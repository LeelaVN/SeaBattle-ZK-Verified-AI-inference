import type { Request, Response } from "express";
import {
  configureProviders,
  buildWalletAndWaitForFunds,
  configurePublicProviders,
} from "../core/provider.js";
import { config, logger } from "../core/testnet-remote.js";
import { deploy } from "../core/apiv2.js";
import { StandaloneConfig } from "../core/config.js";
import { mapContainerPort } from "../core/cli.js";
import { ledger } from "../core/contract/index.js";



export const state = async (
  req: Request<
    {},
    {},
    {
      contract_address: string;
    }
  >,
  res: Response
) => {
  try {
    // GET SEED and Coordinates, create the game

    const { contract_address } = req.body;

    if (!contract_address) {
      throw new Error("Invalid input: contract_address is required.");
    }

    try {
      const providers = await configurePublicProviders(config);

      const contractState =
        await providers.publicDataProvider.queryContractState(contract_address);
      // .then((contractState) =>
      // contractState != null ? ledger(contractState.data).players[Symbol.iterator]() : [],
      // )

      if (!contractState) {
        throw new Error("Contract state not found.");
      }

      const stateData = ledger(contractState.data);

      const playersData: { key: string; revealed: number[] }[] = [];

      for (const [key, value] of stateData.players) {
        const _revealed: number[] = [];
        for (const _value of stateData.playersRevealed.lookup(key)) {
          _revealed.push(Number(_value));
        }
        playersData.push({
          key: Buffer.from(key).toString("hex"),
          revealed: _revealed,
        });
      }

      const parseData = {
        gameEnded: stateData.gameEnded,
        salt: Buffer.from(stateData.roomSalt).toString("hex"),
        playersData,
        turn: Buffer.from(stateData.turn).toString("hex"),
        count: Number(stateData.roomCount),
      };

      res.status(200).json({
        success: true,
        result: parseData,
      });
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
    }

    // const response = {
    //     player1: player1Hex,
    //     shipCoordinates,
    // };
  } catch (error: any) {
    res.status(200).json({ success: false, error: error.message });
  }
};
