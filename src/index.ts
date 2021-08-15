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
  const apiPromise = await providePolkadotApi(
    network
  );
  await apiPromise.isReady;
  return apiPromise;
};

// ~ VALUES ~

async function logSelectedCandidates(api: ApiPromise) {
  const selected =
    await api.query.parachainStaking.selectedCandidates();
  console.log(selected.toJSON());
};

async function logCandidatePool(api: ApiPromise) {
    const pool =
        await api.query.parachainStaking.candidatePool();
    // TODO: convert amount from hex to balance
    console.log(pool.toJSON());
};

async function logExitQueue(api: ApiPromise) {
    const exitQ = await api.query.parachainStaking.exitQueue2();
    console.log(exitQ.toJSON());
}

async function logRoundInfo(api: ApiPromise) {
    const round = await api.query.parachainStaking.round();
    console.log(round.toJSON());
}

async function logInflationConfig(api: ApiPromise) {
    const config = await api.query.parachainStaking.inflationConfig();
    // TODO: convert amount from hex to balance
    console.log(config.toJSON());
}

async function logParachainBondInfo(api: ApiPromise) {
    const parachainBondInfo = await api.query.parachainStaking.parachainBondInfo();
    // TODO: convert amount from hex to balance
    console.log(parachainBondInfo.toJSON());
}

async function logTotalLocked(api: ApiPromise) {
    const totalLocked = await api.query.parachainStaking.total();
    // TODO: convert amount from hex to balance
    console.log(totalLocked.toJSON());
}

async function logCollatorCommission(api: ApiPromise) {
    const commission = await api.query.parachainStaking.collatorCommission();
    // TODO: convert amount from perbill to percent
    console.log(commission.toJSON());
}

async function logTotalSelected(api: ApiPromise) {
    const totalSelected = await api.query.parachainStaking.totalSelected();
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
    console.log("SELECTED CANDIDATES:");
    await logSelectedCandidates(moonriverApi);
    console.log("CANDIDATE POOL:");
    await logCandidatePool(moonriverApi);
    console.log("ROUND INFO:");
    await logRoundInfo(moonriverApi);
    console.log("INFLATION CONFIGURATION:");
    await logInflationConfig(moonriverApi);
    console.log("PARACHAIN BOND CONFIGURATION:");
    await logParachainBondInfo(moonriverApi);
    console.log("PENDING EXITS:");
    await logExitQueue(moonriverApi);
    console.log("TOTAL LOCKED:");
    await logTotalLocked(moonriverApi);
    console.log("COLLATOR COMMISSION CONFIGURATION:");
    await logCollatorCommission(moonriverApi);
    console.log("TOTAL SELECTED ELIGIBLE AUTHORS PER ROUND:");
    await logTotalSelected(moonriverApi);
    moonriverApi.disconnect();
    console.log("DISCONNECTED FROM " + moonRiverWss);
}

main()