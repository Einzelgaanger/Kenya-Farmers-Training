import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Wallet, FileCheck } from 'lucide-react';

interface OfferCalculatorProps {
  faceValue: number;
  supplierName?: string;
  buyerName?: string;
  discountRate: string;
  onDiscountChange: (rate: string) => void;
}

const PRESETS = [
  { value: '3', label: '3% · Low risk' },
  { value: '5', label: '5% · Standard' },
  { value: '7', label: '7% · Moderate' },
  { value: '10', label: '10% · Higher' },
  { value: '12', label: '12% · Premium' },
];

/** Adapted from Malipo Polepole SPV offer calculator for private-sector AFIX */
export default function OfferCalculator({
  faceValue,
  supplierName,
  buyerName,
  discountRate,
  onDiscountChange,
}: OfferCalculatorProps) {
  const [offerPrice, setOfferPrice] = useState(0);

  useEffect(() => {
    const rate = parseFloat(discountRate) || 0;
    setOfferPrice(Math.round(faceValue * (1 - rate / 100)));
  }, [discountRate, faceValue]);

  const margin = faceValue - offerPrice;
  const marginPct = offerPrice > 0 ? (margin / offerPrice) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-brand-blue-light/60 rounded-xl border border-primary/10">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-primary">
          <Wallet size={16} />
          Calculate purchase offer
        </h4>

        <label className="block text-xs text-muted-foreground mb-1.5">Discount rate</label>
        <select
          value={discountRate}
          onChange={e => onDiscountChange(e.target.value)}
          className="w-full px-3 py-2.5 border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 mb-3"
        >
          {PRESETS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <div className="p-3 bg-card rounded-lg border space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Face value</span>
            <span className="font-mono font-medium">{formatCurrency(faceValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Net pay to supplier</span>
            <span className="font-mono font-medium text-accent">{formatCurrency(offerPrice)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="text-muted-foreground">SPV margin</span>
            <span className="font-mono font-semibold text-accent">
              {formatCurrency(margin)} ({marginPct.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-brand-green-light/50 rounded-xl border border-accent/20">
        <h4 className="text-sm font-semibold text-accent flex items-center gap-2 mb-2">
          <FileCheck size={16} />
          Assignment summary
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          On acceptance, a deed of assignment moves the receivable from{' '}
          <strong className="text-foreground">{supplierName || 'Supplier'}</strong> to AFIX Capital SPV.
          Buyer <strong className="text-foreground">{buyerName || 'Buyer'}</strong> will be asked to consent
          so settlement is directed to the trust account.
        </p>
      </div>
    </div>
  );
}
