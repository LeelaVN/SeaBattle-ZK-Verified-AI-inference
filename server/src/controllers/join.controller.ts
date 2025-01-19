import type { Request, Response } from "express";
import {
  configureProviders,
  buildWalletAndWaitForFunds,
} from "../core/provider.js";
import { config, logger } from "../core/testnet-remote.js";
import { deploy, join } from "../core/apiv2.js";
import { StandaloneConfig } from "../core/config.js";
import { mapContainerPort } from "../core/cli.js";

const GENESIS_MINT_WALLET_SEED = '0000000000000000000000000000000000000000000000000000000000000042';

const sizes = {
  Carrier: 5,
  Battleship: 4,
  Cruiser: 3,
  Submarine: 3,
  Destroyer: 2,
} as const;

export const joinController = async (
  req: Request<
    {},
    {},
    {
      seed: string;
      coordinates: Record<string, number[]>;
      secret_key: string;
      contract_address: string;
    }
  >,
  res: Response
) => {
  try {

    const { seed, coordinates, secret_key,contract_address } = req.body;

    if (!seed || typeof coordinates !== "object" || !secret_key) {
      throw new Error("Invalid input: seed and coordinates are required.");
    }

    for (const [key, value] of Object.entries(sizes)) {
      if (coordinates[key].length !== value) {
        throw new Error(
          `Invalid input: ${key} must have exactly ${value} coordinates.`
        );
      }

      for (const [key, value] of Object.entries(coordinates)) {
        const coordSet = new Set(value);
        if (coordSet.size !== value.length) {
          throw new Error(`Invalid input: ${key} coordinates must be unique.`);
        }

        const isHorizontal = value.every(
          (coord: number, index: number, arr: number[]) =>
            index === 0 || coord === arr[index - 1] + 1
        );

        const isVertical = value.every(
          (coord: number, index: number, arr: number[]) =>
            index === 0 || coord === arr[index - 1] + 10
        );

        if (!isHorizontal && !isVertical) {
          throw new Error(
            `Invalid input: ${key} coordinates must be either all horizontal or all vertical.`
          );
        }
      }
    }

    const combinedCoordinates: bigint[] = Object.values(coordinates)
      .flat()
      .map((coord) => BigInt(coord));

    const wallet = await buildWalletAndWaitForFunds(config, seed);

    try {
      if (wallet !== null) {
        const providers = await configureProviders(wallet, config);

        const { game, contract } = await join(
          providers,
          combinedCoordinates,
          secret_key,
          contract_address
        );
        res.status(200).json({
          success: true,
          result: {
            game,
            cAddress: contract.deployTxData.public.contractAddress,
          },
        });
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Found error '${e.message}'`);
        logger.info("Exiting...");
        logger.debug(`${e.stack}`);
        res.status(400).json({
          success: true,
          error: e.message,
        });
      } else {
        throw e;
      }
    } finally {
      try {
        if (wallet !== null) {
          await wallet.close();
        }
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
