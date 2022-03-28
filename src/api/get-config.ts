import { getBurrow } from "../utils";
import { ViewMethodsLogic } from "../interfaces/contract-methods";
import { IConfig } from "../interfaces";

const getConfig = async (): Promise<IConfig> => {
  const { view, logicContract } = await getBurrow();

  const config = (await view(
    logicContract,
    ViewMethodsLogic[ViewMethodsLogic.get_config],
  )) as IConfig;

  return config;
};

export default getConfig;
