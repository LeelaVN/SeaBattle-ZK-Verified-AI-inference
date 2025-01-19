'use strict';
const __compactRuntime = require('@midnight-ntwrk/compact-runtime');
const expectedRuntimeVersionString = '0.7.0';
const expectedRuntimeVersion = expectedRuntimeVersionString.split('-')[0].split('.').map(Number);
const actualRuntimeVersion = __compactRuntime.versionString.split('-')[0].split('.').map(Number);
if (expectedRuntimeVersion[0] != actualRuntimeVersion[0]
     || (actualRuntimeVersion[0] == 0 && expectedRuntimeVersion[1] != actualRuntimeVersion[1])
     || expectedRuntimeVersion[1] > actualRuntimeVersion[1]
     || (expectedRuntimeVersion[1] == actualRuntimeVersion[1] && expectedRuntimeVersion[2] > actualRuntimeVersion[2]))
   throw new __compactRuntime.CompactError(`Version mismatch: compiled code expects ${expectedRuntimeVersionString}, runtime is ${__compactRuntime.versionString}`);
{ const MAX_FIELD = 102211695604070082112571065507755096754575920209623522239390234855480569854275933742834077002685857629445612735086326265689167708028928n;
  if (__compactRuntime.MAX_FIELD !== MAX_FIELD)
     throw new __compactRuntime.CompactError(`compiler thinks maximum field value is ${MAX_FIELD}; run time thinks it is ${__compactRuntime.MAX_FIELD}`)
}

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeBoolean();

class _Maybe_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value) {
    return {
      is_some: _descriptor_1.fromValue(value),
      value: _descriptor_0.fromValue(value)
    }
  }
  toValue(value) {
    return _descriptor_1.toValue(value.is_some).concat(_descriptor_0.toValue(value.value));
  }
}

const _descriptor_2 = new _Maybe_0();

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_4 = new __compactRuntime.CompactTypeVector(17, _descriptor_3);

const _descriptor_5 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_6 = new __compactRuntime.CompactTypeEnum(1, 1);

class _Maybe_1 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_4.alignment());
  }
  fromValue(value) {
    return {
      is_some: _descriptor_1.fromValue(value),
      value: _descriptor_4.fromValue(value)
    }
  }
  toValue(value) {
    return _descriptor_1.toValue(value.is_some).concat(_descriptor_4.toValue(value.value));
  }
}

const _descriptor_7 = new _Maybe_1();

const _descriptor_8 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value) {
    return {
      bytes: _descriptor_0.fromValue(value)
    }
  }
  toValue(value) {
    return _descriptor_0.toValue(value.bytes);
  }
}

const _descriptor_9 = new _ContractAddress_0();

class Contract {
  witnesses;
  constructor(...args) {
    if (args.length !== 1)
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args.length}`);
    const witnesses = args[0];
    if (typeof(witnesses) !== 'object')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    if (typeof(witnesses.attack) !== 'function')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named attack');
    if (typeof(witnesses.local_ships) !== 'function')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named local_ships');
    if (typeof(witnesses.local_sk) !== 'function')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named local_sk');
    this.witnesses = witnesses;
    this.circuits = {
      create: (...args_0) => {
        if (args_0.length !== 1)
          throw new __compactRuntime.CompactError(`create: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
        const contextOrig = args_0[0];
        if (!(typeof(contextOrig) === 'object' && contextOrig.originalState != undefined && contextOrig.transactionContext != undefined))
          __compactRuntime.type_error('create',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/battleship.compact line 40, char 1',
                                      'CircuitContext',
                                      contextOrig)
        const context = { ...contextOrig };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result = this.#_create_0(context, partialProofData);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result, context: context, proofData: partialProofData };
      },
      join: (...args_0) => {
        if (args_0.length !== 1)
          throw new __compactRuntime.CompactError(`join: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
        const contextOrig = args_0[0];
        if (!(typeof(contextOrig) === 'object' && contextOrig.originalState != undefined && contextOrig.transactionContext != undefined))
          __compactRuntime.type_error('join',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/battleship.compact line 52, char 1',
                                      'CircuitContext',
                                      contextOrig)
        const context = { ...contextOrig };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result = this.#_join_0(context, partialProofData);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result, context: context, proofData: partialProofData };
      },
      move: (...args_0) => {
        if (args_0.length !== 2)
          throw new __compactRuntime.CompactError(`move: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
        const contextOrig = args_0[0];
        const guess = args_0[1];
        if (!(typeof(contextOrig) === 'object' && contextOrig.originalState != undefined && contextOrig.transactionContext != undefined))
          __compactRuntime.type_error('move',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/battleship.compact line 70, char 1',
                                      'CircuitContext',
                                      contextOrig)
        if (!(typeof(guess) === 'bigint' && guess >= 0 && guess <= 255n))
          __compactRuntime.type_error('move',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/battleship.compact line 70, char 1',
                                      'Uint<0..255>',
                                      guess)
        const context = { ...contextOrig };
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(guess),
            alignment: _descriptor_3.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result = this.#_move_0(context, partialProofData, guess);
        partialProofData.output = { value: _descriptor_6.toValue(result), alignment: _descriptor_6.alignment() };
        return { result: result, context: context, proofData: partialProofData };
      },
      public_ships: (...args_0) => {
        if (args_0.length !== 2)
          throw new __compactRuntime.CompactError(`public_ships: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
        const contextOrig = args_0[0];
        const coordinates = args_0[1];
        if (!(typeof(contextOrig) === 'object' && contextOrig.originalState != undefined && contextOrig.transactionContext != undefined))
          __compactRuntime.type_error('public_ships',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/battleship.compact line 115, char 1',
                                      'CircuitContext',
                                      contextOrig)
        if (!(Array.isArray(coordinates) && coordinates.length === 17 && coordinates.every((t) => typeof(t) === 'bigint' && t >= 0 && t <= 255n)))
          __compactRuntime.type_error('public_ships',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/battleship.compact line 115, char 1',
                                      'Vector<17, Uint<0..255>>',
                                      coordinates)
        const context = { ...contextOrig };
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(coordinates),
            alignment: _descriptor_4.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result = this.#_public_ships_0(context,
                                             partialProofData,
                                             coordinates);
        partialProofData.output = { value: _descriptor_0.toValue(result), alignment: _descriptor_0.alignment() };
        return { result: result, context: context, proofData: partialProofData };
      },
      public_key: (...args_0) => {
        if (args_0.length !== 2)
          throw new __compactRuntime.CompactError(`public_key: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
        const contextOrig = args_0[0];
        const sk = args_0[1];
        if (!(typeof(contextOrig) === 'object' && contextOrig.originalState != undefined && contextOrig.transactionContext != undefined))
          __compactRuntime.type_error('public_key',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/battleship.compact line 138, char 1',
                                      'CircuitContext',
                                      contextOrig)
        if (!(sk.buffer instanceof ArrayBuffer && sk.BYTES_PER_ELEMENT === 1 && sk.length === 32))
          __compactRuntime.type_error('public_key',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/battleship.compact line 138, char 1',
                                      'Bytes<32>',
                                      sk)
        const context = { ...contextOrig };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(sk),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result = this.#_public_key_0(context, partialProofData, sk);
        partialProofData.output = { value: _descriptor_0.toValue(result), alignment: _descriptor_0.alignment() };
        return { result: result, context: context, proofData: partialProofData };
      }
    };
    this.impureCircuits = {
      create: this.circuits.create,
      join: this.circuits.join,
      move: this.circuits.move,
      public_ships: this.circuits.public_ships
    };
  }
  initialState(...args) {
    if (args.length !== 2)
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 2 arguments (as invoked from Typescript), received ${args.length}`);
    const constructorContext = args[0];
    const salt = args[1];
    if (typeof(constructorContext) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(salt.buffer instanceof ArrayBuffer && salt.BYTES_PER_ELEMENT === 1 && salt.length === 32))
      __compactRuntime.type_error('Contract state constructor',
                                  'argument 1 (argument 2 as invoked from Typescript)',
                                  'src/battleship.compact line 33, char 1',
                                  'Bytes<32>',
                                  salt)
    const state = new __compactRuntime.ContractState();
    let stateValue = __compactRuntime.StateValue.newArray();
    stateValue = stateValue.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue = stateValue.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue = stateValue.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue = stateValue.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue = stateValue.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue = stateValue.arrayPush(__compactRuntime.StateValue.newNull());
    state.data = stateValue;
    state.setOperation('create', new __compactRuntime.ContractOperation());
    state.setOperation('join', new __compactRuntime.ContractOperation());
    state.setOperation('move', new __compactRuntime.ContractOperation());
    state.setOperation('public_ships', new __compactRuntime.ContractOperation());
    const context = {
      originalState: state,
      currentPrivateState: constructorContext.initialPrivateState,
      currentZswapLocalState: constructorContext.initialZswapLocalState,
      transactionContext: new __compactRuntime.QueryContext(state.data, __compactRuntime.dummyContractAddress())
    };
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ])
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(1n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(0n),
                                                                            alignment: _descriptor_5.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ])
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(2n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ])
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(3n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ])
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(4n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ])
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(5n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(false),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ])
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(3n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(salt),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ]);
    const tmp = new Uint8Array(32);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(4n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ]);
    state.data = context.transactionContext.state;
    return {
      currentContractState: state,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  #_persistent_hash_0(context, partialProofData, value) {
    const result = __compactRuntime.persistentHash(_descriptor_8, value);
    return result;
  }
  #_persistent_commit_0(context, partialProofData, value, rand) {
    const result = __compactRuntime.persistentCommit(_descriptor_4, value, rand);
    return result;
  }
  #_create_0(context, partialProofData) {
    __compactRuntime.assert(this.#_equal_0(_descriptor_5.fromValue(Contract._query(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_3.toValue(0n),
                                                                                                               alignment: _descriptor_3.alignment() } }
                                                                                                   ] } },
                                                                                    'size',
                                                                                    { popeq: { cached: true,
                                                                                               result: undefined } }
                                                                                   ]).value),
                                           0n),
                            'Should be empty');
    const tmp = this.#_public_key_0(context,
                                    partialProofData,
                                    this.#_local_sk_or_error_0(context,
                                                               partialProofData));
    const tmp_0 = this.#_public_ships_0(context,
                                        partialProofData,
                                        this.#_local_ships_or_error_0(context,
                                                                      partialProofData));
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(0n),
                                                alignment: _descriptor_3.alignment() } }
                                    ] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }
                    ]);
    const tmp_1 = this.#_public_key_0(context,
                                      partialProofData,
                                      this.#_local_sk_or_error_0(context,
                                                                 partialProofData));
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(2n),
                                                alignment: _descriptor_3.alignment() } }
                                    ] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }
                    ]);
  }
  #_join_0(context, partialProofData) {
    __compactRuntime.assert(this.#_equal_1(_descriptor_5.fromValue(Contract._query(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_3.toValue(0n),
                                                                                                               alignment: _descriptor_3.alignment() } }
                                                                                                   ] } },
                                                                                    'size',
                                                                                    { popeq: { cached: true,
                                                                                               result: undefined } }
                                                                                   ]).value),
                                           1n),
                            'Should be empty');
    const pubkey = this.#_public_key_0(context,
                                       partialProofData,
                                       this.#_local_sk_or_error_0(context,
                                                                  partialProofData));
    let tmp;
    __compactRuntime.assert(!(tmp = this.#_public_key_0(context,
                                                        partialProofData,
                                                        this.#_local_sk_or_error_0(context,
                                                                                   partialProofData)),
                              _descriptor_1.fromValue(Contract._query(context,
                                                                      partialProofData,
                                                                      [
                                                                       { dup: { n: 0 } },
                                                                       { idx: { cached: false,
                                                                                pushPath: false,
                                                                                path: [
                                                                                       { tag: 'value',
                                                                                         value: { value: _descriptor_3.toValue(0n),
                                                                                                  alignment: _descriptor_3.alignment() } }
                                                                                      ] } },
                                                                       { push: { storage: false,
                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp),
                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                       'member',
                                                                       { popeq: { cached: true,
                                                                                  result: undefined } }
                                                                      ]).value)),
                            'Already exists');
    const tmp_0 = this.#_public_key_0(context,
                                      partialProofData,
                                      this.#_local_sk_or_error_0(context,
                                                                 partialProofData));
    const tmp_1 = this.#_public_ships_0(context,
                                        partialProofData,
                                        this.#_local_ships_or_error_0(context,
                                                                      partialProofData));
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(0n),
                                                alignment: _descriptor_3.alignment() } }
                                    ] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }
                    ]);
    const tmp_2 = this.#_public_key_0(context,
                                      partialProofData,
                                      this.#_local_sk_or_error_0(context,
                                                                 partialProofData));
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(2n),
                                                alignment: _descriptor_3.alignment() } }
                                    ] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }
                    ]);
  }
  #_attack_0(context, partialProofData, coordinates) {
    const witnessContext = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState, result] = this.witnesses.attack(witnessContext,
                                                             coordinates);
    context.currentPrivateState = nextPrivateState;
    if (!(typeof(result) === 'number' && result >= 0 && result <= 1))
      __compactRuntime.type_error('attack',
                                  'return value',
                                  'src/battleship.compact line 68, char 1',
                                  'Enum<GuessState, hit, miss>',
                                  result)
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_6.toValue(result),
      alignment: _descriptor_6.alignment()
    });
    return result;
  }
  #_move_0(context, partialProofData, guess) {
    __compactRuntime.assert(_descriptor_1.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_3.toValue(5n),
                                                                                                alignment: _descriptor_3.alignment() } }
                                                                                    ] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }
                                                                    ]).value)
                            ===
                            false,
                            'game is over');
    __compactRuntime.assert(this.#_equal_2(_descriptor_5.fromValue(Contract._query(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_3.toValue(0n),
                                                                                                               alignment: _descriptor_3.alignment() } }
                                                                                                   ] } },
                                                                                    'size',
                                                                                    { popeq: { cached: true,
                                                                                               result: undefined } }
                                                                                   ]).value),
                                           2n),
                            'Should not be less than 2');
    let tmp;
    __compactRuntime.assert(!this.#_equal_3((tmp = this.#_public_key_0(context,
                                                                       partialProofData,
                                                                       this.#_local_sk_or_error_0(context,
                                                                                                  partialProofData)),
                                             _descriptor_5.fromValue(Contract._query(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_3.toValue(2n),
                                                                                                                 alignment: _descriptor_3.alignment() } },
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_0.toValue(tmp),
                                                                                                                 alignment: _descriptor_0.alignment() } }
                                                                                                     ] } },
                                                                                      'size',
                                                                                      { popeq: { cached: true,
                                                                                                 result: undefined } }
                                                                                     ]).value)),
                                            17n),
                            'Game Over');
    let tmp_0;
    const ships_hash = (tmp_0 = this.#_public_key_0(context,
                                                    partialProofData,
                                                    this.#_local_sk_or_error_0(context,
                                                                               partialProofData)),
                        _descriptor_0.fromValue(Contract._query(context,
                                                                partialProofData,
                                                                [
                                                                 { dup: { n: 0 } },
                                                                 { idx: { cached: false,
                                                                          pushPath: false,
                                                                          path: [
                                                                                 { tag: 'value',
                                                                                   value: { value: _descriptor_3.toValue(0n),
                                                                                            alignment: _descriptor_3.alignment() } }
                                                                                ] } },
                                                                 { idx: { cached: false,
                                                                          pushPath: false,
                                                                          path: [
                                                                                 { tag: 'value',
                                                                                   value: { value: _descriptor_0.toValue(tmp_0),
                                                                                            alignment: _descriptor_0.alignment() } }
                                                                                ] } },
                                                                 { popeq: { cached: false,
                                                                            result: undefined } }
                                                                ]).value));
    __compactRuntime.assert(this.#_equal_4(ships_hash,
                                           this.#_public_ships_0(context,
                                                                 partialProofData,
                                                                 this.#_local_ships_or_error_0(context,
                                                                                               partialProofData))),
                            'Mismatch');
    __compactRuntime.assert(!this.#_equal_5(_descriptor_0.fromValue(Contract._query(context,
                                                                                    partialProofData,
                                                                                    [
                                                                                     { dup: { n: 0 } },
                                                                                     { idx: { cached: false,
                                                                                              pushPath: false,
                                                                                              path: [
                                                                                                     { tag: 'value',
                                                                                                       value: { value: _descriptor_3.toValue(4n),
                                                                                                                alignment: _descriptor_3.alignment() } }
                                                                                                    ] } },
                                                                                     { popeq: { cached: false,
                                                                                                result: undefined } }
                                                                                    ]).value),
                                            this.#_public_key_0(context,
                                                                partialProofData,
                                                                this.#_local_sk_or_error_0(context,
                                                                                           partialProofData))),
                            'Should not move again');
    let tmp_1;
    __compactRuntime.assert(!(tmp_1 = this.#_public_key_0(context,
                                                          partialProofData,
                                                          this.#_local_sk_or_error_0(context,
                                                                                     partialProofData)),
                              _descriptor_1.fromValue(Contract._query(context,
                                                                      partialProofData,
                                                                      [
                                                                       { dup: { n: 0 } },
                                                                       { idx: { cached: false,
                                                                                pushPath: false,
                                                                                path: [
                                                                                       { tag: 'value',
                                                                                         value: { value: _descriptor_3.toValue(2n),
                                                                                                  alignment: _descriptor_3.alignment() } },
                                                                                       { tag: 'value',
                                                                                         value: { value: _descriptor_0.toValue(tmp_1),
                                                                                                  alignment: _descriptor_0.alignment() } }
                                                                                      ] } },
                                                                       { push: { storage: false,
                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(guess),
                                                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                                                       'member',
                                                                       { popeq: { cached: true,
                                                                                  result: undefined } }
                                                                      ]).value)),
                            'Already hit here');
    __compactRuntime.assert(guess < 100n, 'Out of bound');
    __compactRuntime.assert(!(guess < 0n), 'Out of bound');
    const hit_or_miss = this.#_attack_0(context, partialProofData, guess);
    if (hit_or_miss === 0) {
      const tmp_2 = this.#_public_key_0(context,
                                        partialProofData,
                                        this.#_local_sk_or_error_0(context,
                                                                   partialProofData));
      Contract._query(context,
                      partialProofData,
                      [
                       { idx: { cached: false,
                                pushPath: true,
                                path: [
                                       { tag: 'value',
                                         value: { value: _descriptor_3.toValue(2n),
                                                  alignment: _descriptor_3.alignment() } },
                                       { tag: 'value',
                                         value: { value: _descriptor_0.toValue(tmp_2),
                                                  alignment: _descriptor_0.alignment() } }
                                      ] } },
                       { push: { storage: false,
                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(guess),
                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                       { push: { storage: true,
                                 value: __compactRuntime.StateValue.newNull().encode() } },
                       { ins: { cached: false, n: 1 } },
                       { ins: { cached: true, n: 2 } }
                      ]);
      let tmp_3;
      if (this.#_equal_6((tmp_3 = this.#_public_key_0(context,
                                                      partialProofData,
                                                      this.#_local_sk_or_error_0(context,
                                                                                 partialProofData)),
                          _descriptor_5.fromValue(Contract._query(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_3.toValue(2n),
                                                                                              alignment: _descriptor_3.alignment() } },
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_0.toValue(tmp_3),
                                                                                              alignment: _descriptor_0.alignment() } }
                                                                                  ] } },
                                                                   'size',
                                                                   { popeq: { cached: true,
                                                                              result: undefined } }
                                                                  ]).value)),
                         17n))
      {
        Contract._query(context,
                        partialProofData,
                        [
                         { push: { storage: false,
                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(5n),
                                                                                alignment: _descriptor_3.alignment() }).encode() } },
                         { push: { storage: true,
                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(true),
                                                                                alignment: _descriptor_1.alignment() }).encode() } },
                         { ins: { cached: false, n: 1 } }
                        ]);
      }
    } else {
      const tmp_4 = this.#_public_key_0(context,
                                        partialProofData,
                                        this.#_local_sk_or_error_0(context,
                                                                   partialProofData));
      Contract._query(context,
                      partialProofData,
                      [
                       { push: { storage: false,
                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(4n),
                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                       { push: { storage: true,
                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_4),
                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                       { ins: { cached: false, n: 1 } }
                      ]);
    }
    return hit_or_miss;
  }
  #_local_ships_0(context, partialProofData) {
    const witnessContext = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState, result] = this.witnesses.local_ships(witnessContext);
    context.currentPrivateState = nextPrivateState;
    if (!(typeof(result) === 'object' && typeof(result.is_some) === 'boolean' && Array.isArray(result.value) && result.value.length === 17 && result.value.every((t) => typeof(t) === 'bigint' && t >= 0 && t <= 255n)))
      __compactRuntime.type_error('local_ships',
                                  'return value',
                                  'src/battleship.compact line 113, char 1',
                                  'struct Maybe<is_some: Boolean, value: Vector<17, Uint<0..255>>>',
                                  result)
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_7.toValue(result),
      alignment: _descriptor_7.alignment()
    });
    return result;
  }
  #_public_ships_0(context, partialProofData, coordinates) {
    return this.#_persistent_commit_0(context,
                                      partialProofData,
                                      coordinates,
                                      _descriptor_0.fromValue(Contract._query(context,
                                                                              partialProofData,
                                                                              [
                                                                               { dup: { n: 0 } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_3.toValue(3n),
                                                                                                          alignment: _descriptor_3.alignment() } }
                                                                                              ] } },
                                                                               { popeq: { cached: false,
                                                                                          result: undefined } }
                                                                              ]).value));
  }
  #_local_ships_or_error_0(context, partialProofData) {
    const maybe_ships = this.#_local_ships_0(context, partialProofData);
    __compactRuntime.assert(maybe_ships.is_some, 'No ships found');
    this.#_folder_0(context,
                    partialProofData,
                    ((context, partialProofData, t, coordinate) =>
                     {
                       __compactRuntime.assert(coordinate < 100n, 'Out of bound');
                       __compactRuntime.assert(!(coordinate < 0n),
                                               'Out of bound');
                       return t;
                     }),
                    false,
                    maybe_ships.value);
    return maybe_ships.value;
  }
  #_local_sk_0(context, partialProofData) {
    const witnessContext = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState, result] = this.witnesses.local_sk(witnessContext);
    context.currentPrivateState = nextPrivateState;
    if (!(typeof(result) === 'object' && typeof(result.is_some) === 'boolean' && result.value.buffer instanceof ArrayBuffer && result.value.BYTES_PER_ELEMENT === 1 && result.value.length === 32))
      __compactRuntime.type_error('local_sk',
                                  'return value',
                                  'src/battleship.compact line 136, char 1',
                                  'struct Maybe<is_some: Boolean, value: Bytes<32>>',
                                  result)
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_2.toValue(result),
      alignment: _descriptor_2.alignment()
    });
    return result;
  }
  #_public_key_0(context, partialProofData, sk) {
    return this.#_persistent_hash_0(context,
                                    partialProofData,
                                    [new Uint8Array([112, 107, 45, 100, 111, 109, 97, 105, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                     sk]);
  }
  #_local_sk_or_error_0(context, partialProofData) {
    const maybe_sk = this.#_local_sk_0(context, partialProofData);
    __compactRuntime.assert(maybe_sk.is_some, 'No secret key found');
    return maybe_sk.value;
  }
  #_equal_0(x0, y0) {
    if (x0 !== y0) return false;
    return true;
  }
  #_equal_1(x0, y0) {
    if (x0 !== y0) return false;
    return true;
  }
  #_equal_2(x0, y0) {
    if (x0 !== y0) return false;
    return true;
  }
  #_equal_3(x0, y0) {
    if (x0 !== y0) return false;
    return true;
  }
  #_equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) return false;
    return true;
  }
  #_equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) return false;
    return true;
  }
  #_equal_6(x0, y0) {
    if (x0 !== y0) return false;
    return true;
  }
  #_folder_0(context, partialProofData, f, x, a0)
  {
    for (let i = 0; i < 17; i++) x = f(context, partialProofData, x, a0[i]);
    return x;
  }
  static _query(context, partialProofData, prog) {
    var res;
    try {
      res = context.transactionContext.query(prog, __compactRuntime.CostModel.dummyCostModel());
    } catch (err) {
      throw new __compactRuntime.CompactError(err.toString());
    }
    context.transactionContext = res.context;
    var reads = res.events.filter((e) => e.tag === 'read');
    var i = 0;
    partialProofData.publicTranscript = partialProofData.publicTranscript.concat(prog.map((op) => {
      if(typeof(op) === 'object' && 'popeq' in op) {
        return { popeq: {
          ...op.popeq,
          result: reads[i++].content,
        } };
      } else {
        return op;
      }
    }));
    if(res.events.length == 1 && res.events[0].tag === 'read') {
      return res.events[0].content;
    } else {
      return res.events;
    }
  }
}
function ledger(state) {
  const context = {
    originalState: state,
    transactionContext: new __compactRuntime.QueryContext(state, __compactRuntime.dummyContractAddress())
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    players: {
      isEmpty(...args) {
        if (args.length !== 0)
          throw new __compactRuntime.CompactError(`is_empty: expected 0 arguments, received ${args.length}`);
        return _descriptor_1.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(0n),
                                                                                   alignment: _descriptor_3.alignment() } }
                                                                       ] } },
                                                        'size',
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(0n),
                                                                                                               alignment: _descriptor_5.alignment() }).encode() } },
                                                        'eq',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }
                                                       ]).value);
      },
      size(...args) {
        if (args.length !== 0)
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args.length}`);
        return _descriptor_5.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(0n),
                                                                                   alignment: _descriptor_3.alignment() } }
                                                                       ] } },
                                                        'size',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }
                                                       ]).value);
      },
      member(...args) {
        if (args.length !== 1)
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args.length}`);
        const key = args[0];
        if (!(key.buffer instanceof ArrayBuffer && key.BYTES_PER_ELEMENT === 1 && key.length === 32))
          __compactRuntime.type_error('member',
                                      'argument 1',
                                      'src/battleship.compact line 23, char 1',
                                      'Bytes<32>',
                                      key)
        return _descriptor_1.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(0n),
                                                                                   alignment: _descriptor_3.alignment() } }
                                                                       ] } },
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key),
                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                        'member',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }
                                                       ]).value);
      },
      lookup(...args) {
        if (args.length !== 1)
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args.length}`);
        const key = args[0];
        if (!(key.buffer instanceof ArrayBuffer && key.BYTES_PER_ELEMENT === 1 && key.length === 32))
          __compactRuntime.type_error('lookup',
                                      'argument 1',
                                      'src/battleship.compact line 23, char 1',
                                      'Bytes<32>',
                                      key)
        return _descriptor_0.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(0n),
                                                                                   alignment: _descriptor_3.alignment() } }
                                                                       ] } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_0.toValue(key),
                                                                                   alignment: _descriptor_0.alignment() } }
                                                                       ] } },
                                                        { popeq: { cached: false,
                                                                   result: undefined } }
                                                       ]).value);
      },
      [Symbol.iterator](...args) {
        if (args.length !== 0)
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args.length}`);
        const self = state.asArray()[0];
        return self.asMap().keys().map(  (key) => {    const value = self.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_0.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get roomCount() {
      return _descriptor_5.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_3.toValue(1n),
                                                                                 alignment: _descriptor_3.alignment() } }
                                                                     ] } },
                                                      { popeq: { cached: true,
                                                                 result: undefined } }
                                                     ]).value);
    },
    playersRevealed: {
      isEmpty(...args) {
        if (args.length !== 0)
          throw new __compactRuntime.CompactError(`is_empty: expected 0 arguments, received ${args.length}`);
        return _descriptor_1.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(2n),
                                                                                   alignment: _descriptor_3.alignment() } }
                                                                       ] } },
                                                        'size',
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(0n),
                                                                                                               alignment: _descriptor_5.alignment() }).encode() } },
                                                        'eq',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }
                                                       ]).value);
      },
      size(...args) {
        if (args.length !== 0)
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args.length}`);
        return _descriptor_5.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(2n),
                                                                                   alignment: _descriptor_3.alignment() } }
                                                                       ] } },
                                                        'size',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }
                                                       ]).value);
      },
      member(...args) {
        if (args.length !== 1)
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args.length}`);
        const key = args[0];
        if (!(key.buffer instanceof ArrayBuffer && key.BYTES_PER_ELEMENT === 1 && key.length === 32))
          __compactRuntime.type_error('member',
                                      'argument 1',
                                      'src/battleship.compact line 26, char 1',
                                      'Bytes<32>',
                                      key)
        return _descriptor_1.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(2n),
                                                                                   alignment: _descriptor_3.alignment() } }
                                                                       ] } },
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key),
                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                        'member',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }
                                                       ]).value);
      },
      lookup(...args) {
        if (args.length !== 1)
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args.length}`);
        const key = args[0];
        if (!(key.buffer instanceof ArrayBuffer && key.BYTES_PER_ELEMENT === 1 && key.length === 32))
          __compactRuntime.type_error('lookup',
                                      'argument 1',
                                      'src/battleship.compact line 26, char 1',
                                      'Bytes<32>',
                                      key)
        if (state.asArray()[2].asMap().get({ value: _descriptor_0.toValue(key),
                                             alignment: _descriptor_0.alignment() }) === undefined)
          throw new __compactRuntime.CompactError(`Map value undefined for ${key}`);
        return {
          isEmpty(...args_0) {
            if (args_0.length !== 0)
              throw new __compactRuntime.CompactError(`is_empty: expected 0 arguments, received ${args_0.length}`);
            return _descriptor_1.fromValue(Contract._query(context,
                                                           partialProofData,
                                                           [
                                                            { dup: { n: 0 } },
                                                            { idx: { cached: false,
                                                                     pushPath: false,
                                                                     path: [
                                                                            { tag: 'value',
                                                                              value: { value: _descriptor_3.toValue(2n),
                                                                                       alignment: _descriptor_3.alignment() } },
                                                                            { tag: 'value',
                                                                              value: { value: _descriptor_0.toValue(key),
                                                                                       alignment: _descriptor_0.alignment() } }
                                                                           ] } },
                                                            'size',
                                                            { push: { storage: false,
                                                                      value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(0n),
                                                                                                                   alignment: _descriptor_5.alignment() }).encode() } },
                                                            'eq',
                                                            { popeq: { cached: true,
                                                                       result: undefined } }
                                                           ]).value);
          },
          size(...args_0) {
            if (args_0.length !== 0)
              throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
            return _descriptor_5.fromValue(Contract._query(context,
                                                           partialProofData,
                                                           [
                                                            { dup: { n: 0 } },
                                                            { idx: { cached: false,
                                                                     pushPath: false,
                                                                     path: [
                                                                            { tag: 'value',
                                                                              value: { value: _descriptor_3.toValue(2n),
                                                                                       alignment: _descriptor_3.alignment() } },
                                                                            { tag: 'value',
                                                                              value: { value: _descriptor_0.toValue(key),
                                                                                       alignment: _descriptor_0.alignment() } }
                                                                           ] } },
                                                            'size',
                                                            { popeq: { cached: true,
                                                                       result: undefined } }
                                                           ]).value);
          },
          member(...args_0) {
            if (args_0.length !== 1)
              throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
            const elem = args_0[0];
            if (!(typeof(elem) === 'bigint' && elem >= 0 && elem <= 255n))
              __compactRuntime.type_error('member',
                                          'argument 1',
                                          'src/battleship.compact line 26, char 48',
                                          'Uint<0..255>',
                                          elem)
            return _descriptor_1.fromValue(Contract._query(context,
                                                           partialProofData,
                                                           [
                                                            { dup: { n: 0 } },
                                                            { idx: { cached: false,
                                                                     pushPath: false,
                                                                     path: [
                                                                            { tag: 'value',
                                                                              value: { value: _descriptor_3.toValue(2n),
                                                                                       alignment: _descriptor_3.alignment() } },
                                                                            { tag: 'value',
                                                                              value: { value: _descriptor_0.toValue(key),
                                                                                       alignment: _descriptor_0.alignment() } }
                                                                           ] } },
                                                            { push: { storage: false,
                                                                      value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(elem),
                                                                                                                   alignment: _descriptor_3.alignment() }).encode() } },
                                                            'member',
                                                            { popeq: { cached: true,
                                                                       result: undefined } }
                                                           ]).value);
          },
          [Symbol.iterator](...args_0) {
            if (args_0.length !== 0)
              throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
            const self = state.asArray()[2].asMap().get({ value: _descriptor_0.toValue(key),
                                                          alignment: _descriptor_0.alignment() });
            return self.asMap().keys().map((elem) => _descriptor_3.fromValue(elem.value))[Symbol.iterator]();
          }
        }
      }
    },
    get roomSalt() {
      return _descriptor_0.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_3.toValue(3n),
                                                                                 alignment: _descriptor_3.alignment() } }
                                                                     ] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }
                                                     ]).value);
    },
    get turn() {
      return _descriptor_0.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_3.toValue(4n),
                                                                                 alignment: _descriptor_3.alignment() } }
                                                                     ] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }
                                                     ]).value);
    },
    get gameEnded() {
      return _descriptor_1.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_3.toValue(5n),
                                                                                 alignment: _descriptor_3.alignment() } }
                                                                     ] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }
                                                     ]).value);
    }
  };
}
const _emptyContext = {
  originalState: new __compactRuntime.ContractState(),
  transactionContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  attack: (...args) => undefined,
  local_ships: (...args) => undefined,
  local_sk: (...args) => undefined
});
const pureCircuits = {
  public_key: (...args) => _dummyContract.circuits.public_key(_emptyContext, ...args).result
};
const contractReferenceLocations = { tag: 'publicLedgerArray', indices: { } };
exports.Contract = Contract;
exports.ledger = ledger;
exports.pureCircuits = pureCircuits;
exports.contractReferenceLocations = contractReferenceLocations;
//# sourceMappingURL=index.cjs.map
