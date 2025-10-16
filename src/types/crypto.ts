export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap: number;
  total_volume: number;
}

export interface PriceHistory {
  timestamp: number;
  price: number;
}

export interface CryptoDetail extends CryptoAsset {
  priceHistory: PriceHistory[];
}
