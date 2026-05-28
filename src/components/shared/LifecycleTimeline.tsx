import { Check, Circle } from 'lucide-react';
import { InvoiceStatus } from '@/types';

const lifecycleSteps: { status: InvoiceStatus; label: string }[] = [
  { status: 'listed', label: 'Listed' },
  { status: 'verified', label: 'Verified' },
  { status: 'offer_received', label: 'Offer Received' },
  { status: 'offer_accepted', label: 'Offer Accepted' },
  { status: 'assigned', label: 'Assigned' },
  { status: 'packaged', label: 'Packaged' },
  { status: 'disbursed', label: 'Disbursed' },
  { status: 'settled', label: 'Settled' },
];

const statusOrder: InvoiceStatus[] = ['draft', 'listed', 'verified', 'offer_received', 'offer_accepted', 'assigned', 'packaged', 'disbursed', 'matured', 'settled'];

interface LifecycleTimelineProps {
  currentStatus: InvoiceStatus;
}

export default function LifecycleTimeline({ currentStatus }: LifecycleTimelineProps) {
  const currentIdx = statusOrder.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {lifecycleSteps.map((step, idx) => {
        const stepIdx = statusOrder.indexOf(step.status);
        const isComplete = currentIdx > stepIdx;
        const isCurrent = currentStatus === step.status;

        return (
          <div key={step.status} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                isComplete ? 'bg-emerald-500 text-white'
                : isCurrent ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground'
              }`}>
                {isComplete ? <Check size={12} /> : <Circle size={8} />}
              </div>
              <span className={`text-[10px] mt-1 whitespace-nowrap ${isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
            {idx < lifecycleSteps.length - 1 && (
              <div className={`w-6 h-0.5 mx-0.5 ${isComplete ? 'bg-emerald-500' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
