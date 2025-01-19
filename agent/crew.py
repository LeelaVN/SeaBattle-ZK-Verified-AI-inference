from crewai import Crew, Agent, Task
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from typing import Tuple, Union
import json
from crewai.tasks.task_output import TaskOutput
from crewai.tools import tool
import time
import asyncio
from crewai.tools.structured_tool import CrewStructuredTool
from pydantic import BaseModel

# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators


def validate_json_output(result: TaskOutput):
    """Validate that the output is valid JSON."""
    print(type(result))
    try:
        json_data = json.loads(result.raw)
        return (True, json_data)
    except json.JSONDecodeError:
        return (False, "Output must be valid JSON")

def validate_json_and_coordinates(result: TaskOutput):
    """Validate that the output is valid JSON."""
    print(type(result))
    try:
        json_data = json.loads(result.raw)
        
        sizes = {
            "Carrier": 5,
            "Battleship": 4,
            "Cruiser": 3,
            "Submarine": 3,
            "Destroyer": 2,
        }

        for key, value in sizes.items():
            if len(json_data[key]) != value:
                return (False, f"Invalid input: {key} must have exactly {value} coordinates.")

        for key, value in json_data.items():
            coord_set = set(value)
            if len(coord_set) != len(value):
                return (False, f"Invalid input: {key} coordinates must be unique.")

            is_horizontal = all(
                index == 0 or coord == value[index - 1] + 1
                for index, coord in enumerate(value)
            )

            is_vertical = all(
                index == 0 or coord == value[index - 1] + 10
                for index, coord in enumerate(value)
            )

            if not is_horizontal and not is_vertical:
                return (False, f"Invalid input: {key} coordinates must be either all horizontal or all vertical.")
        return (True, json_data)
    except json.JSONDecodeError:
        return (False, "Output must be valid JSON")

def create_coordinates(agent: Agent) -> Task:
    return Task(
        guardrail=validate_json_and_coordinates,
        max_retries=200,
        name="create_coordinates",
        agent=agent,
        description="Generate a valid 10x10 battleship random layout using five ships with sizes 5 (Carrier), 4 (Battleship), 3 (Cruiser), 3 (Submarine), and 2 (Destroyer). Place each ship either horizontally or vertically at random, ensuring that the layout is hard for the opponent to guess and all coordinates used are unique.",
        expected_output="""Generate a valid 10x10 battleship random layout using five ships with sizes 5 (Carrier), 4 (Battleship), 3 (Cruiser), 3 (Submarine), and 2 (Destroyer).
Place each ship either horizontally or vertically at random, ensuring that the layout is hard for the opponent to guess and all coordinates used are unique.

The coordinates range from 0 to 99, representing a 10×10 grid where:

    0 corresponds to the top-left cell (row 0, column 0)
    9 corresponds to the top-right cell (row 0, column 9)
    90 corresponds to the bottom-left cell (row 9, column 0)
    99 corresponds to the bottom-right cell (row 9, column 9)

Return the result only in the following JSON format, ensuring all values in the arrays are unique:

{
“Carrier”: number[],
“Battleship”: number[],
“Cruiser”: number[],
“Submarine”: number[],
“Destroyer”: number[]
}
""",
    )

from crewai import LLM

# Advanced configuration with detailed parameters
llm = LLM(
    model="gpt-4o-mini",
    temperature=1,        # Higher for more creative outputs
    frequency_penalty=1, # Reduce repetition
)

def player() -> Agent:
    return Agent(
        verbose=False,
        role="Player {number}",
        backstory="""You are player {number} in the battleship game, known for your strategic decision-making skills and your ability to analyze previous moves. You place your ships randomly to make it harder for your opponent, all while maintaining a humorous and sarcastic attitude.

        Here is the current game status:

            Previous Moves: {moves}
            Last Move: {last_move}
        """,
        goal="Place ships randomly for opponent hard to guess and make good moves in the battleship game.",
        llm=llm
    )

# To learn more about structured task outputs,
# task dependencies, and task callbacks, check out the documentation:
# https://docs.crewai.com/concepts/tasks#overview-of-a-task


def make_move(agent: Agent) -> Task:
    return Task(
        guardrail=validate_json_output,
        max_retries=10,
        name="make_move",
        agent=agent,
        description="{moves}. Ensure you make a strategic move with the aim of hitting the ship.",
        expected_output='Format in the following JSON schema {"move": coordinate, "reason": reason} Return only JSON in your response. Do not include any any code blocks or other text.'
    )


playerAgent = player()

tasks = {
    "create_coordinates": create_coordinates(playerAgent),
    "make_move": make_move(playerAgent)
}


def make_crew(task: str) -> Crew:

    return Crew(
        agents=[playerAgent],
        tasks=[tasks[task]]
    )
