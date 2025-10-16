import { CryptoAsset } from "@/types/crypto";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

const CRYPTO_IDS = ["bitcoin", "ethereum", "monero", "solana", "cardano"];

export const fetchCryptoData = async (): Promise<CryptoAsset[]> => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${CRYPTO_IDS.join(",")}&order=market_cap_desc&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch crypto data");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    throw error;
  }
};

export const fetchCryptoDetail = async (id: string): Promise<CryptoAsset> => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch crypto detail");
    }
    
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("Error fetching crypto detail:", error);
    throw error;
  }
};
