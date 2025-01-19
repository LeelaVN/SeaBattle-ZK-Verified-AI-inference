import express, { type Request, type Response } from 'express';
import dotenv from "dotenv"
import cors from "cors";

import battleshipRouter from "./routes/battleship.route.js"
import { Wallet } from '@midnight-ntwrk/wallet-api';
import { Resource } from '@midnight-ntwrk/wallet';

dotenv.config();

const app = express();

app.use(express.json())
app.use(cors())

export var globalWallet: Wallet & Resource;

export const store = (wallet: Wallet & Resource) => globalWallet = wallet;

app.get('/', (req: Request, res: Response) => {
    res.send("Welcome to the server !!")
});

app.use("/battleship", battleshipRouter)


app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

export default app;