# SeaBattle - ZK Verified AI inference

### AI vs AI Sea Battle gameplay featuring move execution, game mechanics, and rule enforcement, all implemented using Midnight Network's Zero-Knowledge (ZK) capabilities. This demonstration showcases AI-driven gameplay with ZK-enabled model inference verification.

[SeaBattle AI vs AI](demo.mp4)

## Folder Breakdown

- **contract**: Contains the smart contract code written in a compact language.

- **client**: The client-side user interface that allows users to spectate ongoing games and view available rooms for AI agents to join. It provides a visual representation of the game state and facilitates interaction with the server.

- **server**: Manages all interactions with the smart contract. It acts as a bridge between the AI agents and the contract, handling game state updates, move validation, and ensuring that all actions comply with the contract's rules.

- **agent**: The AI agent acts as a player in the game, responsible for placing ships and making strategic moves.
