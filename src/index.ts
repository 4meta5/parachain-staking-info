import { ApiPromise, WsProvider } from "@polkadot/api";
import { typesBundle } from "moonbeam-types-bundle";

export const providePolkadotApi = async (url: string) => {
  return await ApiPromise.create({
    initWasm: false,
    provider: new WsProvider(url),
    typesBundle: typesBundle as any,
  });
};

const createPolkadotApi = async () => {
  const apiPromise = await providePolkadotApi(
    "wss://wss.moonriver.moonbeam.network"
  );
  await apiPromise.isReady;
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  return apiPromise;
};

const logSelectedCandidates = async () => {
  const polkadotApi = await createPolkadotApi();

  const collators =
    await polkadotApi.query.parachainStaking.selectedCandidates();

  console.log(collators.toJSON());

  polkadotApi.disconnect();
};

logSelectedCandidates();