import { type ContractAddress } from "@midnight-ntwrk/compact-runtime";
import {
  type CoinInfo,
  nativeToken,
  Transaction,
  type TransactionId,
} from "@midnight-ntwrk/ledger";
import {
  deployContract,
  findDeployedContract,
} from "@midnight-ntwrk/midnight-js-contracts";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import {
  type BalancedTransaction,
  createBalancedTx,
  type MidnightProvider,
  type UnbalancedTransaction,
  type WalletProvider,
} from "@midnight-ntwrk/midnight-js-types";
import { type Resource, WalletBuilder } from "@midnight-ntwrk/wallet";
import { type Wallet } from "@midnight-ntwrk/wallet-api";
import { Transaction as ZswapTransaction } from "@midnight-ntwrk/zswap";
import * as crypto from "crypto";
import { webcrypto } from "crypto";
import { type Logger } from "pino";
import * as Rx from "rxjs";
import { WebSocket } from "ws";
import {
  type CounterContract,
  type CounterProviders,
  type DeployedCounterContract,
  type PrivateStates,
} from "./common-types.js";
import { type Config, contractConfig } from "./config.js";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { toHex } from "@midnight-ntwrk/midnight-js-utils";
import {
  getLedgerNetworkId,
  getZswapNetworkId,
} from "@midnight-ntwrk/midnight-js-network-id";

import { Contract, witnesses, ledger } from "./contract/index.js";
import { createInterface, type Interface } from "node:readline/promises";
import { config, dockerEnv, logger } from "./standalone.js";

import fs from "fs"


console.log(witnesses);

// @ts-ignore: It's needed to make Scala.js and WASM code able to use cryptography
globalThis.crypto = webcrypto;

// @ts-ignore: It's needed to enable WebSocket usage through apollo
globalThis.WebSocket = WebSocket;

export const createWalletAndMidnightProvider = async (
  wallet: Wallet
): Promise<WalletProvider & MidnightProvider> => {
  const state = await Rx.firstValueFrom(wallet.state());
  return {
    coinPublicKey: state.coinPublicKey,
    balanceTx(
      tx: UnbalancedTransaction,
      newCoins: CoinInfo[]
    ): Promise<BalancedTransaction> {
      return wallet
        .balanceTransaction(
          ZswapTransaction.deserialize(
            tx.serialize(getLedgerNetworkId()),
            getZswapNetworkId()
          ),
          newCoins
        )
        .then((tx) => wallet.proveTransaction(tx))
        .then((zswapTx) =>
          Transaction.deserialize(
            zswapTx.serialize(getZswapNetworkId()),
            getLedgerNetworkId()
          )
        )
        .then(createBalancedTx);
    },
    submitTx(tx: BalancedTransaction): Promise<TransactionId> {
      return wallet.submitTransaction(tx);
    },
  };
};

export const configureProviders = async (
  wallet: Wallet & Resource,
  config: Config
) => {
  const walletAndMidnightProvider =
    await createWalletAndMidnightProvider(wallet);
  return {
    privateStateProvider: levelPrivateStateProvider<PrivateStates>({
      privateStateStoreName: contractConfig.privateStateStoreName,
    }),
    publicDataProvider: indexerPublicDataProvider(
      config.indexer,
      config.indexerWS
    ),
    zkConfigProvider: new NodeZkConfigProvider<"create">(
      contractConfig.zkConfigPath
    ),
    proofProvider: httpClientProofProvider(config.proofServer),
    walletProvider: walletAndMidnightProvider,
    midnightProvider: walletAndMidnightProvider,
  };
};

export const configurePublicProviders = async (
  config: Config
) => {
  return {
    privateStateProvider: levelPrivateStateProvider<PrivateStates>({
      privateStateStoreName: contractConfig.privateStateStoreName,
    }),
    publicDataProvider: indexerPublicDataProvider(
      config.indexer,
      config.indexerWS
    ),
    zkConfigProvider: new NodeZkConfigProvider<"create">(
      contractConfig.zkConfigPath
    ),
    proofProvider: httpClientProofProvider(config.proofServer),
  };
};

export const buildWalletAndWaitForFunds = async (
  { indexer, indexerWS, node, proofServer }: Config,
  seed: string
): Promise<Wallet & Resource> => {

  // Check if walletState.json exists
  if (fs.existsSync(`${seed}.txt`)) {
    // Read the existing wallet state from the file
    const serializedState = fs.readFileSync(`${seed}.txt`, 'utf-8');

    // Restore the wallet using the existing state
    const wallet = await WalletBuilder.restore(
      indexer,
      indexerWS,
      proofServer,
      node,
      serializedState,
      "warn"
    );
    wallet.start();

    const state = await Rx.firstValueFrom(wallet.state());
    logger.info(`Your wallet seed is: ${seed}`);
    logger.info(`Your wallet address is: ${state.address}`);
  
    console.log(nativeToken());
    let balance = state.balances[nativeToken()];
  
    if (true) {
      logger.info(`Your wallet balance is: 0`);
      logger.info(`Waiting to receive tokens...`);
      balance = await waitForFunds(wallet);
    }
    logger.info(`Your wallet balance is: ${balance}`);

    const reserializedState = await wallet.serializeState();


    fs.writeFileSync(`${seed}.txt`, reserializedState, 'utf8');

    return wallet;
  }
  const wallet = await WalletBuilder.buildFromSeed(
    indexer,
    indexerWS,
    proofServer,
    node,
    seed,
    getZswapNetworkId(),
    "warn"
  );
  wallet.start();
  const state = await Rx.firstValueFrom(wallet.state());
  logger.info(`Your wallet seed is: ${seed}`);
  logger.info(`Your wallet address is: ${state.address}`);

  console.log(nativeToken());
  let balance = state.balances[nativeToken()];

  if (balance === undefined || balance === 0n) {
    logger.info(`Your wallet balance is: 0`);
    logger.info(`Waiting to receive tokens...`);
    balance = await waitForFunds(wallet);
  }
  logger.info(`Your wallet balance is: ${balance}`);

  const serializedState = await wallet.serializeState();


  fs.writeFileSync(`${seed}.txt`, serializedState, 'utf8');

  return wallet;
};

export const waitForFunds = (wallet: Wallet) =>
  Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.throttleTime(10_000),
      Rx.tap((state) => {
        const scanned = state.syncProgress?.synced ?? 0n;
        const total = state.syncProgress?.total.toString() ?? "unknown number";
        logger.info(
          `Wallet processed ${scanned} indices out of ${total}, transactions=${state.transactionHistory.length}`
        );
      }),
      Rx.filter((state) => {
        // Let's allow progress only if wallet is synced
        const synced = state.syncProgress?.synced;
        const total = state.syncProgress?.total;
        return synced !== undefined && synced === total;
      }),
      Rx.map((s) => s.balances[nativeToken()] ?? 0n),
      Rx.filter((balance) => balance > 0n)
    )
  );
