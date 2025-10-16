import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { fetchCryptoData } from "@/services/cryptoApi";
import { CryptoAsset } from "@/types/crypto";
import { CryptoCard } from "@/components/CryptoCard";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [cryptos, setCryptos] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadCryptos = async () => {
    try {
      const data = await fetchCryptoData();
      setCryptos(data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível buscar os preços das criptomoedas",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCryptos();
    
    // Update every 30 seconds
    const interval = setInterval(loadCryptos, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-slow text-primary">
          <RefreshCw className="w-12 h-12 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Crypto Tracker
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Acompanhe os preços das principais criptomoedas em tempo real
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cryptos.map((crypto) => (
            <CryptoCard 
              key={crypto.id}
              asset={crypto}
              onClick={() => navigate(`/crypto/${crypto.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
