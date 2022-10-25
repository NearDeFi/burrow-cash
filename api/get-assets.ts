import { getAllMetadata, getAssetsDetailed, getPrices } from "../store";

const getPrice = (tokenId, priceResponse, metadata) => {
  const price = priceResponse.prices.find((p) => p.asset_id === tokenId)?.price || undefined;
  if (!price) return 0;
  const usd = Number(price.multiplier) / 10 ** (price.decimals - metadata.decimals);
  return { ...price, usd };
};

const getAssets = async () => {
  const assets = await getAssetsDetailed();
  const tokenIds = assets.map((asset) => asset.token_id);
  const metadata = await getAllMetadata(tokenIds);
  const priceResponse = await getPrices();

  return {
    assets: assets.map((asset) => ({
      ...asset,
      price: getPrice(
        asset.token_id,
        priceResponse,
        metadata.find((m) => m.token_id === asset.token_id),
      ),
    })),
    metadata,
  };
};

export default getAssets;
