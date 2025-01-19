import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Maybe<a> = { is_some: boolean; value: a };

export type Witnesses<T> = {
  attack(context: __compactRuntime.WitnessContext<Ledger, T>,
         coordinates: bigint): [T, number];
  local_ships(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Maybe<bigint[]>];
  local_sk(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Maybe<Uint8Array>];
}

export type ImpureCircuits<T> = {
  create(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, void>;
  join(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, void>;
  move(context: __compactRuntime.CircuitContext<T>, guess: bigint): __compactRuntime.CircuitResults<T, number>;
  public_ships(context: __compactRuntime.CircuitContext<T>,
               coordinates: bigint[]): __compactRuntime.CircuitResults<T, Uint8Array>;
}

export type PureCircuits = {
  public_key(sk: Uint8Array): Uint8Array;
}

export type Circuits<T> = {
  create(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, void>;
  join(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, void>;
  move(context: __compactRuntime.CircuitContext<T>, guess: bigint): __compactRuntime.CircuitResults<T, number>;
  public_ships(context: __compactRuntime.CircuitContext<T>,
               coordinates: bigint[]): __compactRuntime.CircuitResults<T, Uint8Array>;
  public_key(context: __compactRuntime.CircuitContext<T>, sk: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
}

export type Ledger = {
  players: {
    isEmpty(): boolean;
    size(): bigint;
    member(key: Uint8Array): boolean;
    lookup(key: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  readonly roomCount: bigint;
  playersRevealed: {
    isEmpty(): boolean;
    size(): bigint;
    member(key: Uint8Array): boolean;
    lookup(key: Uint8Array): {
      isEmpty(): boolean;
      size(): bigint;
      member(elem: bigint): boolean;
      [Symbol.iterator](): Iterator<bigint>
    }
  };
  readonly roomSalt: Uint8Array;
  readonly turn: Uint8Array;
  readonly gameEnded: boolean;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>, salt: Uint8Array): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
