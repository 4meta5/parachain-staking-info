import { ApiPromise, WsProvider } from "@polkadot/api";
import { typesBundle } from "moonbeam-types-bundle";

const moonRiverWss = "wss://wss.moonriver.moonbeam.network";

export const providePolkadotApi = async (url: string) => {
  return await ApiPromise.create({
    initWasm: false,
    provider: new WsProvider(url),
    typesBundle,
  });
};

async function createPolkadotApi(network: string) {
  const apiPromise = await providePolkadotApi(network);
  await apiPromise.isReady;
  return apiPromise;
};

// ~ STORAGE VALUES ~

async function printSelectedCandidates(api: ApiPromise) {
  const selected =await getSelectedCandidates(api)
  console.log("SELECTED CANDIDATES:");
  console.log(selected);
};

async function getSelectedCandidates(api: ApiPromise):Promise<string[]> {
  const selected =
    await api.query.parachainStaking.selectedCandidates();
  return selected.toHuman() as string[]
};

async function printStateForSelectedCandidates(api: ApiPromise) {
  const selected = await getSelectedCandidates(api);
  console.log("STATE FOR SELECTED CANDIDATES:");
  for (var collator of selected as any) {
    await printCollatorState(api, collator);
  }
}

async function candidatePool(api: ApiPromise) {
    const pool =
        await api.query.parachainStaking.candidatePool();
    console.log("CANDIDATE POOL:");
    console.log(pool.toHuman());
};

async function exitQueue(api: ApiPromise) {
    const exitQ = await api.query.parachainStaking.exitQueue2();
    console.log("PENDING EXITS:");
    console.log(exitQ.toHuman());
}

async function roundInfo(api: ApiPromise) {
    const round = await api.query.parachainStaking.round();
    console.log("ROUND INFO:");
    console.log(round.toHuman());
}

async function inflationConfig(api: ApiPromise) {
    const config = await api.query.parachainStaking.inflationConfig();
    console.log("INFLATION CONFIGURATION:");
    console.log(config.toHuman());
}

async function parachainBondInfo(api: ApiPromise) {
    const parachainBondInfo = await api.query.parachainStaking.parachainBondInfo();
    console.log("PARACHAIN BOND CONFIGURATION:");
    console.log(parachainBondInfo.toHuman());
}

async function totalLocked(api: ApiPromise) {
    const totalLocked = await api.query.parachainStaking.total();
    console.log("TOTAL LOCKED:");
    console.log(totalLocked.toHuman());
}

async function collatorCommission(api: ApiPromise) {
    const commission = await api.query.parachainStaking.collatorCommission();
    console.log("COLLATOR COMMISSION:");
    // TODO: convert amount from perbill to percent
    console.log(commission.toHuman());
}

async function totalSelected(api: ApiPromise) {
    const totalSelected = await api.query.parachainStaking.totalSelected();
    console.log("TOTAL SELECTED ELIGIBLE AUTHORS PER ROUND:");
    console.log(totalSelected.toHuman());
}

// ~ STORAGE MAPS ~

async function printCollatorState(api: ApiPromise, collator: string) {
  const state = await api.query.parachainStaking.collatorState2(collator);
  console.log("COLLATOR STATE FOR " + collator + " :");
  console.log(state.toHuman())//.toHuman());
}

async function printNominatorState(api: ApiPromise, nominator: string) {
  const state = await api.query.parachainStaking.nominatorState2(nominator);
  console.log("NOMINATOR STATE FOR " + nominator + " :");
  console.log(state.toHuman());
}

// TODO: ALL STORAGE MAPS
// - for all accounts in selected candidates, log printCollatorState in json [done]
// - all top nominations for a given collator
// - log all bottom nominations for a given collator
// - log all nominations for a given nominator
// - log all nominators

async function main() {
    console.log("QUERYING " + moonRiverWss + " INFO");
    const moonriverApi = await createPolkadotApi(moonRiverWss);
    await printSelectedCandidates(moonriverApi);
    await printStateForSelectedCandidates(moonriverApi);
    // await candidatePool(moonriverApi);
    // await roundInfo(moonriverApi);
    // await inflationConfig(moonriverApi);
    // await parachainBondInfo(moonriverApi);
    // await exitQueue(moonriverApi);
    // await totalLocked(moonriverApi);
    // await collatorCommission(moonriverApi);
    // await totalSelected(moonriverApi);
    moonriverApi.disconnect();
    console.log("DISCONNECTED FROM " + moonRiverWss);
}

main()