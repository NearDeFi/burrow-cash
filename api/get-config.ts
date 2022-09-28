import { getBurrow } from "../utils";
import { ViewMethodsLogic } from "../interfaces/contract-methods";
import { IConfig } from "../interfaces";

const getConfig = async (): Promise<IConfig> => {
  const { view, logicContract } = await getBurrow();

  try {
    const config = (await view(
      logicContract,
      ViewMethodsLogic[ViewMethodsLogic.get_config],
    )) as IConfig;

    return config;
  } catch (e) {
    console.error(e);
    throw new Error("getConfig");
  }
};

export default getConfig;
