import asyncio
import json
from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/api/fraud", tags=["fraud"])

_connections: set[WebSocket] = set()


async def broadcast_fraud_alert(payload: dict[str, Any]):
    message = json.dumps({"type": "fraud_alert", "data": payload})
    stale: set[WebSocket] = set()
    for ws in list(_connections):
        try:
            await ws.send_text(message)
        except Exception:
            stale.add(ws)
    _connections.difference_update(stale)


def schedule_fraud_alert(payload: dict[str, Any]):
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(broadcast_fraud_alert(payload))
    except RuntimeError:
        pass


@router.websocket("/ws")
async def fraud_websocket(websocket: WebSocket):
    await websocket.accept()
    _connections.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        _connections.discard(websocket)
