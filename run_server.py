"""Launch the web server from any working directory."""
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

import uvicorn

if __name__ == "__main__":
    os.chdir(ROOT)

    # Railway (and most PaaS) inject PORT; fall back to 8000 locally.
    port = int(os.environ.get("PORT", 8000))

    # Bind to all interfaces in production so the platform can route to us.
    # Stay on localhost in pure local dev (no PORT env var set).
    host = "0.0.0.0" if "PORT" in os.environ else "127.0.0.1"

    # Disable reload in production — it forks a second process which Railway
    # doesn't expect and can cause port-binding conflicts.
    dev = "PORT" not in os.environ

    uvicorn.run(
        "server.app:app",
        host=host,
        port=port,
        reload=dev,
        reload_dirs=[ROOT] if dev else None,
    )
