import { PriceHistory } from "@/types/crypto";
import { Card } from "@/components/ui/card";

interface PriceHistoryListProps {
  history: PriceHistory[];
}

export const PriceHistoryList = ({ history }: PriceHistoryListProps) => {
  return (
    <Card className="p-4 bg-gradient-card backdrop-blur-sm border-border mt-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Histórico Recente</h3>
      <div className="space-y-2">
        {history.slice(0, 10).map((item, index) => (
          <div 
            key={index}
            className="flex justify-between items-center py-2 px-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <span className="text-sm text-muted-foreground">
              {new Date(item.timestamp).toLocaleTimeString('pt-BR')}
            </span>
            <span className="text-sm font-semibold text-foreground">
              ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
