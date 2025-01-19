import type { Request, Response } from "express";
import {
  configureProviders,
  buildWalletAndWaitForFunds,
} from "../core/provider.js";
import { config, logger } from "../core/testnet-remote.js";
import { deploy, join } from "../core/apiv2.js";
import { StandaloneConfig } from "../core/config.js";
import { mapContainerPort } from "../core/cli.js";
import { nativeToken } from "@midnight-ntwrk/ledger";
import { globalWallet, store } from "../app.js";

const GENESIS_MINT_WALLET_SEED =
  "0000000000000000000000000000000000000000000000000000000000000042";

const sizes = {
  Carrier: 5,
  Battleship: 4,
  Cruiser: 3,
  Submarine: 3,
  Destroyer: 2,
} as const;

export const transfer = async (
  req: Request<
    {},
    {},
    {
      address: string;
    }
  >,
  res: Response
) => {
  try {
    // GET SEED and Coordinates, create the game
    console.log(globalWallet);

    const { address } = req.body;

    if (!address) {
      throw new Error("Invalid input: seed and coordinates are required.");
    }

    const env = await dockerEnv.up();
    if (config instanceof StandaloneConfig) {
      config.indexer = mapContainerPort(env, config.indexer, "counter-indexer");
      config.indexerWS = mapContainerPort(
        env,
        config.indexerWS,
        "counter-indexer"
      );
      config.node = mapContainerPort(env, config.node, "counter-node");
      config.proofServer = mapContainerPort(
        env,
        config.proofServer,
        "counter-proof-server"
      );
    }

    try {
      if (globalWallet) {
        const tx = await globalWallet.transferTransaction([
          {
            amount: 2500000000n,
            receiverAddress: address,
            type: nativeToken(),
          },
        ]);

        const provedTx = await globalWallet.proveTransaction(tx);

        const txHash = await globalWallet.submitTransaction(provedTx);

        console.log(`Transaction hash: ${txHash}`);

        res.status(200).json({
          success: true,
          result: {
            txHash,
          },
        });
      } else {
        const wallet = await buildWalletAndWaitForFunds(
          config,
          GENESIS_MINT_WALLET_SEED
        );

        store(wallet);

        const tx = await wallet.transferTransaction([
          {
            amount: 2500000000n,
            receiverAddress: address,
            type: nativeToken(),
          },
        ]);

        const provedTx = await wallet.proveTransaction(tx);

        const txHash = await wallet.submitTransaction(provedTx);

        console.log(`Transaction hash: ${txHash}`);

        res.status(200).json({
          success: true,
          result: {
            txHash,
          },
        });

      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Found error '${e.message}'`);
        logger.info("Exiting...");
        logger.debug(`${e.stack}`);
      } else {
        throw e;
      }
    } finally {
      try {
      } catch (e) {
        console.log(e);
      }
    }

    // const response = {
    //     player1: player1Hex,
    //     shipCoordinates,
    // };
  } catch (error: any) {
    res.status(200).json({ success: false, error: error.message });
  }
};
