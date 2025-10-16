import { CryptoAsset } from "@/types/crypto";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CryptoCardProps {
  asset: CryptoAsset;
  onClick: () => void;
}

export const CryptoCard = ({ asset, onClick }: CryptoCardProps) => {
  const isPositive = asset.price_change_percentage_24h >= 0;
  
  return (
    <Card 
      onClick={onClick}
      className="p-4 bg-gradient-card backdrop-blur-sm border-border hover:border-primary transition-all duration-300 cursor-pointer hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img 
            src={asset.image} 
            alt={asset.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-bold text-foreground">{asset.name}</h3>
            <p className="text-sm text-muted-foreground uppercase">{asset.symbol}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground">
            ${asset.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
          isPositive 
            ? 'bg-success/10 text-success' 
            : 'bg-destructive/10 text-destructive'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-semibold">
            {Math.abs(asset.price_change_percentage_24h).toFixed(2)}%
          </span>
        </div>
      </div>
    </Card>
  );
};
