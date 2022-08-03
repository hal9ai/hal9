from typing import Dict

from fastapi import FastAPI
import bussin
from fastapi.responses import HTMLResponse
import demoUserScript
app = FastAPI()

@app.get('/', response_class=HTMLResponse)
async def get_designer():
    return bussin.__get_designer()

@app.post("/eval")
async def create_item(manifest: Dict):
    return bussin.__process_request(manifest)

