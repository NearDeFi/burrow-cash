import { getAllMetadata, getAssetsDetailed } from "../store";

const getAssets = async () => {
  const assets = await getAssetsDetailed();
  const tokenIds = assets.map((asset) => asset.token_id);
  const metadata = await getAllMetadata(tokenIds);
  return { assets, metadata };
};

export default getAssets;
