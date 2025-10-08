import { PosTerminal } from '@/components/PosTerminal';

export function Sales() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sales Terminal</h2>
        <p className="text-muted-foreground">
          Process sales transactions
        </p>
      </div>
      
      <PosTerminal />
    </div>
  );
}