import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WaterfallInput {
  bill_id: string;
  deed_id: string;
  trust_account_id: string;
  obligor_payment_amount: number;
  tax_rate?: number;       // e.g. 0.16 for 16% WHT
  trustee_fee_rate?: number; // e.g. 0.005 for 0.5%
  admin_fee_rate?: number;   // e.g. 0.003 for 0.3%
  interest_rate?: number;    // e.g. 0.08 for 8%
  principal_amount?: number; // override, otherwise = obligor_payment - all fees
}

interface WaterfallResult {
  taxes_amount: number;
  trustee_fees_amount: number;
  admin_fees_amount: number;
  interest_amount: number;
  principal_amount: number;
  residual_amount: number;
}

function calculateWaterfall(input: WaterfallInput): WaterfallResult {
  const total = input.obligor_payment_amount;
  const taxRate = input.tax_rate ?? 0;
  const trusteeFeeRate = input.trustee_fee_rate ?? 0.005;
  const adminFeeRate = input.admin_fee_rate ?? 0.003;
  const interestRate = input.interest_rate ?? 0.08;

  // Priority 1: Taxes and statutory charges
  const taxes_amount = Math.round(total * taxRate * 100) / 100;
  let remaining = total - taxes_amount;

  // Priority 2: Trustee & administrative fees
  const trustee_fees_amount = Math.round(total * trusteeFeeRate * 100) / 100;
  remaining -= trustee_fees_amount;

  const admin_fees_amount = Math.round(total * adminFeeRate * 100) / 100;
  remaining -= admin_fees_amount;

  // Priority 3: Interest to investors
  const interest_amount = Math.round(total * interestRate * 100) / 100;
  remaining -= interest_amount;

  // Priority 4: Principal repayment
  const principal = input.principal_amount ?? remaining;
  const principal_amount = Math.min(principal, remaining);
  remaining -= principal_amount;

  // Priority 5: Residual (if any)
  const residual_amount = Math.max(0, Math.round(remaining * 100) / 100);

  return {
    taxes_amount,
    trustee_fees_amount,
    admin_fees_amount,
    interest_amount,
    principal_amount,
    residual_amount,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { action, ...params } = await req.json();

    if (action === 'calculate') {
      // Just calculate without saving
      const result = calculateWaterfall(params as WaterfallInput);
      return new Response(JSON.stringify({ success: true, waterfall: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create_distribution') {
      const input = params as WaterfallInput;
      const waterfall = calculateWaterfall(input);

      const { data, error } = await supabase
        .from('waterfall_distributions')
        .insert({
          bill_id: input.bill_id,
          deed_id: input.deed_id,
          trust_account_id: input.trust_account_id,
          obligor_payment_amount: input.obligor_payment_amount,
          tax_rate: input.tax_rate ?? 0,
          trustee_fee_rate: input.trustee_fee_rate ?? 0.005,
          admin_fee_rate: input.admin_fee_rate ?? 0.003,
          interest_rate: input.interest_rate ?? 0.08,
          ...waterfall,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, distribution: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'execute_distribution') {
      const { distribution_id } = params;

      // Get the distribution
      const { data: dist, error: distError } = await supabase
        .from('waterfall_distributions')
        .select('*')
        .eq('id', distribution_id)
        .single();

      if (distError) throw distError;
      if (dist.status === 'distributed') {
        return new Response(JSON.stringify({ error: 'Already distributed' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create settlement transactions for each tranche
      const tranches = [
        { type: 'tax_deduction', amount: dist.taxes_amount },
        { type: 'trustee_fee', amount: dist.trustee_fees_amount },
        { type: 'admin_fee', amount: dist.admin_fees_amount },
        { type: 'interest_payment', amount: dist.interest_amount },
        { type: 'principal_repayment', amount: dist.principal_amount },
        { type: 'residual_distribution', amount: dist.residual_amount },
      ].filter(t => t.amount > 0);

      const transactions = tranches.map(t => ({
        waterfall_id: distribution_id,
        bill_id: dist.bill_id,
        from_account_id: dist.trust_account_id,
        transaction_type: t.type,
        amount: t.amount,
        status: 'authorized',
        authorized_at: new Date().toISOString(),
      }));

      const { error: txError } = await supabase
        .from('settlement_transactions')
        .insert(transactions);

      if (txError) throw txError;

      // Update distribution status
      const { error: updateError } = await supabase
        .from('waterfall_distributions')
        .update({
          status: 'distributed',
          distributed_at: new Date().toISOString(),
        })
        .eq('id', distribution_id);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true, transactions_created: tranches.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
