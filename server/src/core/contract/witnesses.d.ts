export type CounterPrivateState = {
    privateKey: Uint8Array | null;
    coordinates: bigint[];
};
import { Ledger, Maybe } from './contract/index.cjs';
import { WitnessContext } from '@midnight-ntwrk/compact-runtime';
export declare const witnesses: {
    attack: ({ privateState }: WitnessContext<Ledger, CounterPrivateState>, guess: bigint) => [CounterPrivateState, number];
    local_sk: ({ privateState }: WitnessContext<Ledger, CounterPrivateState>) => [CounterPrivateState, Maybe<Uint8Array>];
    local_ships: ({ privateState }: WitnessContext<Ledger, CounterPrivateState>) => [CounterPrivateState, Maybe<bigint[]>];
};
