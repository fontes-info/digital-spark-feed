import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { fetchCryptoDetail } from "@/services/cryptoApi";
import { CryptoAsset, PriceHistory } from "@/types/crypto";
import { PriceChart } from "@/components/PriceChart";
import { PriceHistoryList } from "@/components/PriceHistoryList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CryptoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [asset, setAsset] = useState<CryptoAsset | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCryptoData = async () => {
    if (!id) return;
    
    try {
      const data = await fetchCryptoDetail(id);
      setAsset(data);
      
      // Add current price to history
      setPriceHistory(prev => [
        ...prev,
        { timestamp: Date.now(), price: data.current_price }
      ].slice(-20)); // Keep last 20 entries
      
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível buscar os dados da criptomoeda",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCryptoData();
    
    // Update every 30 seconds
    const interval = setInterval(loadCryptoData, 30000);
    
    return () => clearInterval(interval);
  }, [id]);

  if (loading || !asset) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-slow text-primary">
          <RefreshCw className="w-12 h-12 animate-spin" />
        </div>
      </div>
    );
  }

  const isPositive = asset.price_change_percentage_24h >= 0;
  const variation = priceHistory.length >= 2 
    ? ((priceHistory[priceHistory.length - 1].price - priceHistory[0].price) / priceHistory[0].price) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="bg-gradient-card backdrop-blur-sm border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={asset.image} 
              alt={asset.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{asset.name}</h1>
              <p className="text-muted-foreground uppercase text-lg">{asset.symbol}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-secondary/30 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Preço Atual</p>
              <p className="text-3xl font-bold text-foreground">
                ${asset.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-secondary/30 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Variação 24h</p>
              <div className={`flex items-center gap-2 text-2xl font-bold ${
                isPositive ? 'text-success' : 'text-destructive'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-6 h-6" />
                ) : (
                  <TrendingDown className="w-6 h-6" />
                )}
                <span>{Math.abs(asset.price_change_percentage_24h).toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {priceHistory.length >= 2 && (
            <div className="bg-secondary/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Variação na Sessão</p>
              <div className={`flex items-center gap-2 text-xl font-bold ${
                variation >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                {variation >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span>{Math.abs(variation).toFixed(2)}%</span>
              </div>
            </div>
          )}

          {priceHistory.length > 1 && (
            <>
              <h2 className="text-xl font-bold text-foreground mb-2">Gráfico de Preços</h2>
              <PriceChart data={priceHistory} isPositive={variation >= 0} />
            </>
          )}
        </div>

        {priceHistory.length > 0 && (
          <PriceHistoryList history={[...priceHistory].reverse()} />
        )}
      </div>
    </div>
  );
};

export default CryptoDetail;
