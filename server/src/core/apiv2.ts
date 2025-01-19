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
import { randomBytes } from "./utils.js";
import { config, dockerEnv, logger } from "./standalone.js";

// @ts-ignore: It's needed to make Scala.js and WASM code able to use cryptography
globalThis.crypto = webcrypto;

// @ts-ignore: It's needed to enable WebSocket usage through apollo
globalThis.WebSocket = WebSocket;

export const counterContractInstance: CounterContract = new Contract(witnesses);

export const deploy = async (
  providers: CounterProviders,
  coordinates: bigint[],
  playerSecretKey: string
): Promise<{
  contract: DeployedCounterContract;
  game: {
    txHash: string;
    salt: string;
  };
}> => {
  const salt = randomBytes(32);

  //   console.log("SALT:" + Buffer.from(salt).toString("hex"));
  //   console.log("player1:" + Buffer.from(player1).toString("hex"));
  logger.info(`Deploying counter contract...`);

  const counterContract = await deployContract(providers, {
    privateStateKey: "counterPrivateState",
    contract: counterContractInstance,
    args: [salt],
    initialPrivateState: {
      coordinates: coordinates,
      privateKey: Buffer.from(playerSecretKey, "hex"),
    },
  });

  logger.info(
    `Deployed contract at address: ${counterContract.deployTxData.public.contractAddress}`
  );

  logger.info(`Creating the Game...`);

  const tx = await counterContract.callTx.create();
  const { txHash, blockHeight } = tx.public;
  logger.info(`Transaction ${txHash} added in block ${blockHeight}`);
  //   return { txHash, blockHeight };

  return {
    contract: counterContract,
    game: {
      salt: Buffer.from(salt).toString("hex"),
      txHash,
    },
  };
};

export const join = async (
  providers: CounterProviders,
  coordinates: bigint[],
  playerSecretKey: string,
  contractAddress: string
): Promise<{
  contract: DeployedCounterContract;
  game: {
    txHash: string;
  };
}> => {
  logger.info(`Deploying counter contract...`);

  const counterContract = await findDeployedContract(providers, {
    contractAddress,
    contract: counterContractInstance,
    privateStateKey: "counterPrivateState",
    initialPrivateState: {
      coordinates: coordinates,
      privateKey: Buffer.from(playerSecretKey, "hex"),
    },
  });

  logger.info(
    `Deployed contract at address: ${counterContract.deployTxData.public.contractAddress}`
  );

  logger.info(`Creating the Game...`);

  const tx = await counterContract.callTx.join();
  const { txHash, blockHeight } = tx.public;
  logger.info(`Transaction ${txHash} added in block ${blockHeight}`);
  //   return { txHash, blockHeight };

  return {
    contract: counterContract,
    game: {
      txHash,
    },
  };
};

export const move = async (
  providers: CounterProviders,
  coordinates: bigint[],
  playerSecretKey: string,
  contractAddress: string,
  guess: number
): Promise<{
  contract: DeployedCounterContract;
  game: {
    txHash: string;
  };
}> => {
  logger.info(`Deploying counter contract...`);

  const counterContract = await findDeployedContract(providers, {
    contractAddress,
    contract: counterContractInstance,
    privateStateKey: "counterPrivateState",
    initialPrivateState: {
      coordinates: coordinates,
      privateKey: Buffer.from(playerSecretKey, "hex"),
    },
  });

  logger.info(
    `Deployed contract at address: ${counterContract.deployTxData.public.contractAddress}`
  );

  logger.info(`Moving the Game...`);

  const tx = await counterContract.callTx.move(BigInt(guess));
  const { txHash, blockHeight } = tx.public;
  logger.info(`Transaction ${txHash} added in block ${blockHeight}`);

  //   return { txHash, blockHeight };

  return {
    contract: counterContract,
    game: {
      txHash,
    },
  };
};
