import subprocess

agent = subprocess.Popen(["python3", "agent.py"])
server = subprocess.Popen(["python3", "agent_server.py"])

try:
    agent.wait()
    server.wait()
except KeyboardInterrupt:
    print("Shutting down...")
    agent.terminate()
    server.terminate()