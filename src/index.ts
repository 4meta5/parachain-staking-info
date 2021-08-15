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

async function logSelectedCandidates(api: ApiPromise) {
  const selected =
    await api.query.parachainStaking.selectedCandidates();
  console.log("SELECTED CANDIDATES:");
  console.log(selected.toJSON());
};

async function logCandidatePool(api: ApiPromise) {
    const pool =
        await api.query.parachainStaking.candidatePool();
    console.log("CANDIDATE POOL:");
    // TODO: convert amount from hex to balance
    console.log(pool.toJSON());
};

async function logExitQueue(api: ApiPromise) {
    const exitQ = await api.query.parachainStaking.exitQueue2();
    console.log("PENDING EXITS:");
    console.log(exitQ.toJSON());
}

async function logRoundInfo(api: ApiPromise) {
    const round = await api.query.parachainStaking.round();
    console.log("ROUND INFO:");
    console.log(round.toJSON());
}

async function logInflationConfig(api: ApiPromise) {
    const config = await api.query.parachainStaking.inflationConfig();
    console.log("INFLATION CONFIGURATION:");
    // TODO: convert amount from hex to balance
    console.log(config.toJSON());
}

async function logParachainBondInfo(api: ApiPromise) {
    const parachainBondInfo = await api.query.parachainStaking.parachainBondInfo();
    console.log("PARACHAIN BOND CONFIGURATION:");
    // TODO: convert amount from hex to balance
    console.log(parachainBondInfo.toJSON());
}

async function logTotalLocked(api: ApiPromise) {
    const totalLocked = await api.query.parachainStaking.total();
    console.log("TOTAL LOCKED:");
    // TODO: convert amount from hex to balance
    console.log(totalLocked.toJSON());
}

async function logCollatorCommission(api: ApiPromise) {
    const commission = await api.query.parachainStaking.collatorCommission();
    console.log("COLLATOR COMMISSION:");
    // TODO: convert amount from perbill to percent
    console.log(commission.toJSON());
}

async function logTotalSelected(api: ApiPromise) {
    const totalSelected = await api.query.parachainStaking.totalSelected();
    console.log("TOTAL SELECTED ELIGIBLE AUTHORS PER ROUND:");
    console.log(totalSelected.toJSON());
}

// TODO: ALL STORAGE MAPS
// all top nominations for a given collator
// log all bottom nominations for a given collator
// log all nominations for a given nominator
// log all nominators

// TODO: move console.log into each function
async function main() {
    console.log("QUERYING " + moonRiverWss + " INFO");
    const moonriverApi = await createPolkadotApi(moonRiverWss);
    await logSelectedCandidates(moonriverApi);
    await logCandidatePool(moonriverApi);
    await logRoundInfo(moonriverApi);
    await logInflationConfig(moonriverApi);
    await logParachainBondInfo(moonriverApi);
    await logExitQueue(moonriverApi);
    await logTotalLocked(moonriverApi);
    await logCollatorCommission(moonriverApi);
    await logTotalSelected(moonriverApi);
    moonriverApi.disconnect();
    console.log("DISCONNECTED FROM " + moonRiverWss);
}

main()