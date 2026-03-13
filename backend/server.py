import atexit
import logging
import os
import subprocess
import time
from pathlib import Path

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from starlette.middleware.cors import CORSMiddleware


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

NODE_PORT = os.environ["NODE_ADAPTER_PORT"]
NODE_BASE_URL = f"http://127.0.0.1:{NODE_PORT}"

logger = logging.getLogger("node_adapter")
logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

node_process = None


def is_node_healthy() -> bool:
    try:
        response = requests.get(f"{NODE_BASE_URL}/health", timeout=1)
        return response.status_code == 200
    except requests.RequestException:
        return False


def start_node_backend() -> None:
    global node_process

    if is_node_healthy():
        logger.info("Node backend is already running.")
        return

    logger.info("Starting Node backend process...")
    env = os.environ.copy()
    env["PORT"] = NODE_PORT

    node_process = subprocess.Popen(
        ["node", "server/server.js"],
        cwd=str(ROOT_DIR),
        env=env,
    )

    for _ in range(30):
        if is_node_healthy():
            logger.info("Node backend started successfully.")
            return
        time.sleep(0.4)

    raise RuntimeError("Node backend failed to start.")


def cleanup_node_process() -> None:
    global node_process
    if node_process and node_process.poll() is None:
        logger.info("Stopping Node backend process...")
        node_process.terminate()
        try:
            node_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            node_process.kill()
    node_process = None


atexit.register(cleanup_node_process)


@app.on_event("startup")
async def startup_event() -> None:
    start_node_backend()


@app.get("/health")
async def health() -> dict:
    return {
        "status": "ok",
        "adapter": "fastapi",
        "node_backend": "up" if is_node_healthy() else "down",
    }


@app.get("/api")
@app.get("/api/")
async def api_root(request: Request) -> Response:
    return await proxy_request("", request)


@app.api_route(
    "/api/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
)
async def proxy_request(path: str, request: Request) -> Response:
    target_url = f"{NODE_BASE_URL}/api/{path}" if path else f"{NODE_BASE_URL}/api"

    try:
        body = await request.body()
        headers = {}
        if request.headers.get("content-type"):
            headers["content-type"] = request.headers["content-type"]

        upstream_response = requests.request(
            method=request.method,
            url=target_url,
            params=dict(request.query_params),
            data=body,
            headers=headers,
            timeout=30,
        )

        content_type = upstream_response.headers.get("content-type", "application/json")
        return Response(
            content=upstream_response.content,
            status_code=upstream_response.status_code,
            media_type=content_type,
        )
    except requests.RequestException:
        return JSONResponse(
            status_code=502,
            content={"message": "Backend service is unavailable. Please retry."},
        )


@app.on_event("shutdown")
async def shutdown_event() -> None:
    cleanup_node_process()
