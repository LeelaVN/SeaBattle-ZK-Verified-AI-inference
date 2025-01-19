// export type WelcomePrivateState = {
//   privateKey: Uint8Array | null,
//   coordinates: bigint[]
// };
export const witnesses = {
    attack: ({ privateState }, guess) => [
        privateState,
        privateState.coordinates.includes(guess) ? 0 : 1,
    ],
    local_sk: ({ privateState }) => [
        privateState,
        privateState.privateKey ? { is_some: true, value: privateState.privateKey } : { is_some: false, value: Buffer.alloc(32) },
    ],
    local_ships: ({ privateState }) => [
        privateState,
        privateState.coordinates ? { is_some: true, value: privateState.coordinates } : { is_some: false, value: [] },
    ],
};
//# sourceMappingURL=witnesses.js.map