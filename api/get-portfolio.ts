import { IAccountDetailed, ViewMethodsLogic } from "../interfaces";
import { getBurrow } from "../utils";

const getPortfolio = async (account_id: string): Promise<IAccountDetailed> => {
  const { view, logicContract } = await getBurrow();

  const accountDetailed = (await view(
    logicContract,
    ViewMethodsLogic[ViewMethodsLogic.get_account],
    {
      account_id,
    },
  )) as IAccountDetailed;

  return accountDetailed;
};

export default getPortfolio;
