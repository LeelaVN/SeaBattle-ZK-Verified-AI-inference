import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { MidnightButton } from "use-midnight";
import { databases } from "./lib/appwrite";
import { Query } from "appwrite";

type gameState = {
  gameEnded: boolean;
  salt: string;
  playersData: { key: string; revealed: number[] }[];
  turn: string;
  count: number;
};

// x * 10 + y

function App() {
  const getParamsFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> | undefined = {};
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    return params;
  };

  const [params, setParams] = useState<string | undefined>(
    getParamsFromUrl()?.room
  );

  // useEffect(() => {
  //   if (Object.keys(params).length > 0) {
  //     console.log("Params from URL:", params);
  //     // You can use the params for further logic here
  //   }
  // }, []);
  const { data } = useQuery<{ result: gameState }>({
    queryKey: ["gameState", params],
    queryFn: () =>
      fetch("http://localhost:5001/battleship/state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contract_address: params }),
      }).then((res) => res.json()),
    refetchInterval: 2000,
    // queryFn: () => ({
    //   gameEnded: false,
    //   playersData: [
    //     {
    //       key: "player 1",
    //       revealed: [0, 1, 2, 3, 99],
    //     },
    //     {
    //       key: "player 2",
    //       revealed: [0, 1, 2, 3, 99],
    //     },
    //   ],
    //   salt: "",
    //   count: 1,
    //   turn: "player 1",
    // }),
  });
  const { data: rooms } = useQuery({
    queryKey: ["gameRooms"],
    // queryFn: () =>
    //   fetch("http://localhost:5000/battleship/state").then((res) => res.json()),
    queryFn: () =>
      databases.listDocuments("678781920024e78acd60", "67889cd700344e518eab"),

    refetchInterval: 4000,
  });

  const { data: aiChat } = useQuery({
    queryKey: ["gameRoomAIChat", data?.result, params],
    // queryFn: () =>
    //   fetch("http://localhost:5000/battleship/state").then((res) => res.json()),
    queryFn: () =>
      data?.result.salt
        ? databases.listDocuments(
            "678781920024e78acd60",
            "6787819e003ac4e2acef",
            [Query.equal("salt", data?.result.salt)]
          )
        : null,

    refetchInterval: 4000,
  });

  console.log(aiChat);

  function coordinateToNumber(coordinate: string): number {
    const row = coordinate.charCodeAt(0) - 65;
    const col = parseInt(coordinate.slice(1), 10);
    return row * 10 + col;
  }

  const isWinner = useMemo(
    () =>
      data?.["result"].gameEnded
        ? data["result"].playersData.find(
            (player) => player.revealed.length !== 17
          )?.key
        : undefined,
    [data]
  );
  return (
    <>
      {params ? (
        <div className="flex gap-20 justify-center" id="board">
          {data &&
            data["result"].playersData.map((player, id) => (
              <div className="">
                <div className="flex gap-4 items-center pt-10">
                  <img
                    src={`/player/${id + 1}-${
                      isWinner
                        ? isWinner === player.key
                          ? "win"
                          : "loss"
                        : data["result"].turn !== player.key
                        ? "wait"
                        : "think"
                    }.png`}
                    alt=""
                    className="w-28 h-28 scale-150 overflow-hidden"
                  />
                  <div className="text-white">{player.key}</div>
                </div>
                {isWinner === player.key && <div className="">Winner</div>}
                {Array.from({ length: 10 }).map((_, rowIndex) => (
                  <div key={rowIndex} style={{ display: "flex" }}>
                    {Array.from({ length: 10 }).map((_, colIndex) => (
                      <div
                        key={colIndex}
                        style={{
                          width: "60px",
                          height: "60px",
                          border: "2px solid #fff",
                          borderRadius: "15px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          margin: "3px",
                        }}
                      >
                        {player.revealed.includes(rowIndex * 10 + colIndex) ? (
                          <div className="bg-green-950 w-full h-full min-w-full flex justify-center items-center rounded-2xl">
                            <img
                              src="/Midnight-RGB_Symbol-White.svg"
                              className="w-10 h-10"
                            />
                          </div>
                        ) : aiChat?.documents
                            .filter((p) => p.player !== player.key)
                            .map((coordinates) =>
                              coordinateToNumber(coordinates.move)
                            )
                            .filter((hit) => !player.revealed.includes(hit))
                            .includes(rowIndex * 10 + colIndex) ? (
                          <div className="bg-red-500 w-full h-full min-w-full rounded-2xl"></div>
                        ) : (
                          <></>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <div
                  className="message-box"
                  style={{
                    marginTop: "20px",
                    color: "#fff",
                    backgroundColor: "#333",
                    padding: "15px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    maxHeight: "450px",
                    overflowY: "auto",
                  }}
                >
                  <div
                    className="message-content"
                    style={{
                      marginTop: "10px",
                      fontSize: "16px",
                      lineHeight: "1.5",
                    }}
                  >
                    {/* Example message */}
                    {aiChat?.documents.length === 0 ? (
                      <>No Moves yet</>
                    ) : (
                      aiChat?.documents
                        .filter((chat) => chat.player === player.key)
                        .map((chat) => (
                          <details
                            style={{
                              padding: "10px 0",
                              borderBottom: "1px solid #444",
                            }}
                          >
                            <summary
                              style={{ cursor: "pointer", color: "#fff" }}
                            >
                              Player 1 has made a move: {chat.move}
                            </summary>
                            <div
                              style={{
                                padding: "5px 0",
                                color: "#ccc",
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                maxWidth: "400px",
                              }}
                            >
                              {chat.reason}
                            </div>
                          </details>
                        ))
                    )}
                  </div>
                </div>
              </div>
            ))}

          {data && data["result"].playersData.length === 1 && (
            <div className="">
              <div className="flex gap-4 items-center pt-10">
                <img
                  src={`/player/2-wait.png`}
                  alt=""
                  className="w-28 h-28 scale-150 overflow-hidden"
                />
                <div className="text-white">Waiting</div>
              </div>
              {Array.from({ length: 10 }).map((_, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex" }}>
                  {Array.from({ length: 10 }).map((_, colIndex) => (
                    <div
                      key={colIndex}
                      style={{
                        width: "60px",
                        height: "60px",
                        border: "2px solid #fff",
                        borderRadius: "15px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "3px",
                      }}
                    ></div>
                  ))}
                </div>
              ))}
              <div
                className="message-box"
                style={{
                  marginTop: "20px",
                  color: "#fff",
                  backgroundColor: "#333",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  maxHeight: "450px",
                  overflowY: "auto",
                }}
              >
                <div
                  className="message-content"
                  style={{
                    marginTop: "10px",
                    fontSize: "18px",
                    lineHeight: "1.6",
                    color: "#f0f0f0",
                    backgroundColor: "#444",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <p style={{ marginBottom: "10px" }}>
                    <strong>To participate:</strong> Set up your agent and
                    connect using the contract address:
                  </p>
                  <p style={{ marginBottom: "10px", fontStyle: "italic" }}>
                    <span style={{ color: "#fff" }}>{params}</span>
                  </p>
                  <p>
                    <strong>Opponent's agent URL: </strong>
                    <span style={{ color: "#fff" }}>
                      {rooms?.documents.find(
                        (room) => room.contract_address === params
                      )?.agents[0] || "Unavailable"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-10">
          <div className="text-2xl font-semibold text-center text-white mb-6">
            Game Rooms
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms?.documents.map((room) => (
              <div
                key={room.contract_address}
                className="card bg-white shadow-md rounded-lg p-6 relative"
              >
                <img
                  src="/Midnight-RGB_Symbol-White.svg"
                  className="w-14 h-14 absolute top-0 right-0 m-2 z-10 bg-black p-2 rounded-full"
                />
                <div className="text-gray-800 font-bold text-xl mb-4">
                  Contract Address: {room.contract_address}
                </div>
                <div className="text-gray-600 text-base">
                  Agents Joined: {room.agents.length}
                </div>
                {room.agents.length < 2 && (
                  <button
                    className="mt-4 bg-neutral-700 hover:bg-black text-white font-bold py-2 px-4 rounded mr-4"
                    onClick={() => {
                      // Handle join room logic here
                      console.log(
                        `Joining room with contract address: ${room.contract_address}`
                      );
                    }}
                  >
                    Join Room
                  </button>
                )}
                <button
                  className="mt-4 bg-neutral-700 hover:bg-black text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set("room", room.contract_address);
                    window.history.pushState({}, "", newUrl);
                    setParams(room.contract_address);
                  }}
                >
                  Spectate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="midnight-button">
        <MidnightButton />
      </div>
    </>
  );
}

export default App;
