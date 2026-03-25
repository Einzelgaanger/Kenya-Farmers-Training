import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const targetEmails = [
      'mow@demo.com',
      'moh@demo.com',
      'moe@demo.com',
      'moit@demo.com',
      'national.treasury@demo.com',
      'admin@demo.com',
    ];

    const results: { email: string; status: string }[] = [];

    const { data: allUsers } = await supabase.auth.admin.listUsers();

    for (const email of targetEmails) {
      const user = allUsers?.users?.find(u => u.email === email);
      if (!user) {
        results.push({ email, status: 'user not found' });
        continue;
      }

      const { error } = await supabase.auth.admin.updateUserById(user.id, {
        password: 'demo1234',
      });

      results.push({ email, status: error ? `error: ${error.message}` : 'password reset to demo1234' });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
