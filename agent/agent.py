#!/usr/bin/env python
import asyncio
from appwrite.id import ID
from appwrite.services.databases import Databases
from appwrite.query import Query
from appwrite.client import Client
import requests
import os
import json
import sys
import warnings
from config import player_turn

from crew import make_crew
import aiohttp

from aiohttp import ClientTimeout
import time
import socket
hostname = socket.gethostname()
IPAddr = socket.gethostbyname(hostname)

print(socket.gethostbyname(hostname))

appwrite_key = ""


client = Client()
client.set_endpoint('https://cloud.appwrite.io/v1')
client.set_project("6787813e002b9d0000d4")
client.set_key(appwrite_key)

databases = Databases(client)


warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

players = {
    0: "PLAYER1",
    1: "PLAYER2"
}

keys = {
    0: {
        "seed": "SEED",
        "sk": "SECRET_KEY"
    }
}

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


async def create_game(seed: str, coordinates: dict[str, list[int]], secret_key: str) -> dict[str, str]:
    url = "http://localhost:5000/battleship/create"
    payload = {
        "seed": seed,
        "coordinates": coordinates,
        "secret_key": secret_key
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload, timeout=timeout) as response:
            return await response.json()


async def join_game(seed: str, coordinates: dict[str, list[int]], secret_key: str, c_address: str):
    url = "http://localhost:5000/battleship/join"
    payload = {
        "seed": seed,
        "coordinates": coordinates,
        "secret_key": secret_key,
        "contract_address": c_address
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload, timeout=timeout) as response:
            return await response.json()


async def receive_attack(seed: str, coordinates: dict[str, list[int]], secret_key: str, c_address: str, guess: int):
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


async def move_game(guess: int, opponent_url, c_address):
    payload = {
        "guess": guess,
        "contract_address": c_address
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(opponent_url, json=payload, timeout=timeout) as response:
            return await response.json()


async def get_game_state(c_address: str):
    url = "http://localhost:5000/battleship/state"
    payload = {
        "contract_address": c_address,
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload, timeout=timeout) as response:
            return await response.json()


# asyncio.run(run())


def display_menu():
    print("Menu:")
    print("1. Create new game")
    print("2. Join game")
    choice = input("Enter your choice (1 or 2): ")

    return choice


async def main():
    if len(sys.argv) > 1:
        choice = sys.argv[1]
    else:
        choice = display_menu()

    if choice == "1":
        p_data = get_player_data(0)
        
        result = make_crew("create_coordinates").kickoff(inputs={
            "moves": "None",
            "last_move": "None",
            "number": "1"
        })

        player1_coordinates = json.loads(result.raw)

        # print(player1_coordinates)

        with open(f'game_data_player_{0}.json', 'w') as outfile:
            json.dump(player1_coordinates, outfile)

        res = await create_game(
            seed=p_data["seed"], coordinates=player1_coordinates, secret_key=p_data["secret_key"]) # type: ignore

        contract_address=res["result"]["cAddress"]# type: ignore

        game_state = (await get_game_state(c_address=contract_address))["result"]         # type: ignore

        player_pubkey = game_state["playersData"][0]["key"]
        

        # {'success': True, 'result': {'game': {'salt': 'd2801855a2be3f2a1d1d7d7c86f023f96955bc3aa9d0d68b62e45219a20d2e23', 'txHash': 'c836002ced6b4319a19cfb43976b3d5e8a6c65255857c0e6987195be2e9c08c3'}, 'cAddress': '0200bb9ba8db7b59d646ada60d049d164896617997575a03f625e2c01c92b76a99a5'}}

        # WAITING FOR PLAYER
        # PLAYER JOINED

        # MAKE MOVEMENTS TO IP ADDRESS DEFINED

        databases.create_document(
            database_id="678781920024e78acd60",
            collection_id="67889cd700344e518eab",
            document_id=ID.unique(),
            data={
                "contract_address": contract_address,  # type: ignore
                # "agents": [socket.gethostbyname(hostname)]
                "agents": ["http://localhost:8081/move"]

            }
        )
        
        opponent_url = None
        
        print(player_pubkey)

        while True:
            await asyncio.sleep(30)

            # type: ignore
            game_state = (await get_game_state(c_address=contract_address))["result"]         # type: ignore
            
            await asyncio.sleep(5)

            if len(game_state["playersData"]) != 2:
                continue

            if game_state["gameEnded"]:
                # won_pubkey = next(player["key"] for player in game_state["playersData"] if len(
                #     player["revealed"]) == 17)

                continue

            if game_state["turn"] != player_pubkey and game_state["turn"] != "0000000000000000000000000000000000000000000000000000000000000000":
                continue
            
            print("MAKING A MOVE")
            
            rooms = databases.list_documents(
                database_id="678781920024e78acd60",
                collection_id="67889cd700344e518eab",
                # type: ignore
                queries=[Query.equal("contract_address", [
                                        contract_address])]         # type: ignore
            )

            for agent in rooms["documents"][0]["agents"]:  # type: ignore
                if agent != socket.gethostbyname(hostname):
                    opponent_url = agent

            raw_moves = next((player["revealed"]
                             for player in game_state["playersData"] if player["key"] != player_pubkey), [])

            def number_to_coordinate(number):
                row = number // 10
                col = number % 10
                return f"{chr(65 + row)}{col}"

            def coordinate_to_number(coordinate):
                row = ord(coordinate[0]) - 65
                col = int(coordinate[1:])
                return row * 10 + col

            moves = None
            try:
                moves = databases.list_documents(
                    database_id="678781920024e78acd60",
                    collection_id="6787819e003ac4e2acef",
                    queries=[Query.equal("salt", [game_state["salt"]]),
                             Query.equal("player", [player_pubkey])]
                )
            except Exception as e:
                print(f"An error occurred while listing documents: {e}")
                moves = {"documents": []}  # Default to an empty list if an error occurs

            missed_coordinates = []

            hit_coordinates = [number_to_coordinate(
                move) for move in raw_moves]

            for todo in moves['documents']:  # type: ignore
                if todo['move'] not in hit_coordinates:  # type: ignore
                    missed_coordinates.append(todo['move'])  # type: ignore

            combined_coordinates = {
                "hit": hit_coordinates,
                "missed": missed_coordinates
            }
            
            print(combined_coordinates)

            ai_prompt = f"Your Moves:\n" \
                        f"Hits: {', '.join(combined_coordinates['hit'])}\n" \
                        f"Misses: {', '.join(combined_coordinates['missed'])}"

            result = make_crew("make_move").kickoff(inputs={
                "moves": ai_prompt,
                "last_move": "None",
                "number": "1"
            })

            resData = (json.loads(result.raw))

            await move_game(guess=coordinate_to_number(resData["move"]), opponent_url=opponent_url, c_address=contract_address)         # type: ignore

            databases.create_document(
                database_id="678781920024e78acd60",
                collection_id="6787819e003ac4e2acef",
                document_id=ID.unique(),
                data={
                    "move": resData["move"], "reason": resData["reason"], "player": player_pubkey, "salt": game_state["salt"]
                }
            )

    elif choice == "2":
        print("Joining an existing game...")

        contract_address = input("Enter ca ")
        opponent_url = "http://localhost:8081/move"

        p_data = get_player_data(0)

        result = make_crew("create_coordinates").kickoff(inputs={
            "moves": "None",
            "last_move": "None",
            "number": "1"
        })

        player1_coordinates = json.loads(result.raw)

        # # print(player1_coordinates)

        with open(f'game_data_player_{1}.json', 'w') as outfile:
            json.dump(player1_coordinates, outfile)

        prev_state = (await get_game_state(c_address=contract_address))["result"]

        res = await join_game(
            seed=p_data["seed"], coordinates=player1_coordinates, secret_key=p_data["secret_key"], c_address=contract_address) # type: ignore

        # # MAKE MOVEMENTS TO IP ADDRESS DEFINED

        game_state = (await get_game_state(c_address=contract_address))["result"]

        player_pubkey = game_state["playersData"][1]["key"]
        
        print(player_pubkey)
        # player_pubkey="fc459b0ee468ab7ea6b1193cec27aa9be41db6d987608609edd4f9a2f704e14c"
        rooms = databases.list_documents(
            database_id="678781920024e78acd60",
            collection_id="67889cd700344e518eab",
            # type: ignore
            queries=[Query.equal("contract_address", [contract_address])]
        )

        databases.update_document(
            database_id="678781920024e78acd60",
            collection_id="67889cd700344e518eab",
            document_id=rooms["documents"][0]["$id"],  # type: ignore
            data={
                "contract_address": res["result"]["cAddress"],  # type: ignore
                # type: ignore
                "agents": [rooms["documents"][0]["agents"][0], "http://localhost:8082/move"]         # type: ignore
            }
        )
        
        print(player_pubkey)

        while True:
            await asyncio.sleep(30)

            game_state = (await get_game_state(c_address=contract_address))["result"]
            
            await asyncio.sleep(5)

            if len(game_state["playersData"]) != 2:
                continue

            if game_state["gameEnded"]:
                # won_pubkey = next(player["key"] for player in game_state["playersData"] if len(
                #     player["revealed"]) == 17)

                continue

            if game_state["turn"] != player_pubkey:
                continue
            
            if game_state["turn"] == "0000000000000000000000000000000000000000000000000000000000000000":
                continue

            print("MAKING A MOVE")
            raw_moves = next((player["revealed"]
                             for player in game_state["playersData"] if player["key"] != player_pubkey), [])

            def number_to_coordinate(number):
                row = number // 10
                col = number % 10
                return f"{chr(65 + row)}{col}"

            def coordinate_to_number(coordinate):
                row = ord(coordinate[0]) - 65
                col = int(coordinate[1:])
                return row * 10 + col

            moves = None
            try:
                moves = databases.list_documents(
                    database_id="678781920024e78acd60",
                    collection_id="6787819e003ac4e2acef",
                    queries=[Query.equal("salt", [game_state["salt"]]),
                             Query.equal("player", [player_pubkey])]
                )
            except Exception as e:
                print(f"An error occurred while listing documents: {e}")
                moves = {"documents": []}  # Default to an empty list if an error occurs

            missed_coordinates = []

            hit_coordinates = [number_to_coordinate(
                move) for move in raw_moves]

            for todo in moves['documents']:  # type: ignore
                if todo['move'] not in hit_coordinates:  # type: ignore
                    missed_coordinates.append(todo['move'])  # type: ignore

            combined_coordinates = {
                "hit": hit_coordinates,
                "missed": missed_coordinates
            }

            ai_prompt = f"Your Moves:\n" \
                        f"Hits: {', '.join(combined_coordinates['hit'])}\n" \
                        f"Misses: {', '.join(combined_coordinates['missed'])}"

            result = make_crew("make_move").kickoff(inputs={
                "moves": ai_prompt,
                "last_move": "None",
                "number": "1"
            })

            resData = (json.loads(result.raw))

            await move_game(guess=coordinate_to_number(resData["move"]), opponent_url=opponent_url, c_address=contract_address)

            databases.create_document(
                database_id="678781920024e78acd60",
                collection_id="6787819e003ac4e2acef",
                document_id=ID.unique(),
                data={
                    "move": resData["move"], "reason": resData["reason"], "player": player_pubkey, "salt": game_state["salt"]
                }
            )
    else:
        print("Invalid choice. Please enter 1 or 2.")

asyncio.run(main())
