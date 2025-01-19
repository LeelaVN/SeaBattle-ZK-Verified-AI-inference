from flask import Flask, request, jsonify
import asyncio
import json
from aiohttp import ClientTimeout
import aiohttp
from config import player_turn

import os
players = {
    0: "PLAYER1",
    1: "PLAYER2"
}


keys = {
    0: {
        "seed": "16e08085597c05ce7a8c4c98e9bf32aa019cc5d51dae1aa59d7a2f39925ca681",
        "sk": "a8c3192dcab91bb3f32575dc93a8ce56c7b6910450c46d73fe886f0fff1a0e9b"
    },
    1: {
        "seed": "73bdd9bd98af1a75eb81e88d9608ea4b3c13eca4722537584754f54c8795acb5",
        "sk": "8e9d7cd7dc3f0ea94fdee36bea4fd12ab699712fac711b1e076ab3f5a470381a"
    }
}

port = {
    0: 8081,
    1: 8082
}

_PORT=port[player_turn]

def get_player_data(p: int):
    seed = os.getenv(
        players[p] + "_SEED", keys[player_turn]["seed"])
    secret_key = os.getenv(
        players[p] + "_SECRET_KEY", keys[player_turn]["sk"])

    return {
        "seed": seed,
        "secret_key": secret_key
    }

timeout = ClientTimeout(
    total=10000000000000000000000000000000000000000000000000000000)

async def receive_attack(seed: str, coordinates: dict[str, list[int]], secret_key: str, c_address: str, guess: int):
    print("RECEIVED", type(coordinates), coordinates)
    url = "http://localhost:5000/battleship/move"
    payload = {
        "seed": seed,
        "coordinates": coordinates,
        "secret_key": secret_key,
        "contract_address": c_address,
        "guess": guess
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload, timeout=timeout) as response:
            return await response.json()



app = Flask(__name__)

@app.route('/move', methods=['POST'])
def handle_move():
    data = request.get_json()
    guess = data.get('guess')
    contract_address = data.get('contract_address')

    if guess is None or contract_address is None:
        return jsonify({'error': 'Invalid input'}), 400
        
    p_data = get_player_data(0)
    
    with open(f'game_data_player_{player_turn}.json', 'r') as infile:
        player1_coordinates = json.load(infile)

    result = asyncio.run(receive_attack(seed=p_data["seed"], c_address=contract_address, coordinates=player1_coordinates, guess=guess, secret_key=p_data["secret_key"]))
    return jsonify(result)

@app.route('/', methods=['GET'])
def handle_hello_world():
    return jsonify({'message': 'hello world'})

app.run(port=_PORT)