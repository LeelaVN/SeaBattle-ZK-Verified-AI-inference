import { type Contract, type Witnesses, type CounterPrivateState } from './contract/index.js';
import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { ImpureCircuitId, type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';

export type PrivateStates = {
  counterPrivateState: CounterPrivateState;
};

export type CounterProviders = MidnightProviders<"create", PrivateStates>;

export type CounterContract = Contract<CounterPrivateState, Witnesses<CounterPrivateState>>;

export type DeployedCounterContract = FoundContract<CounterPrivateState, CounterContract>;
