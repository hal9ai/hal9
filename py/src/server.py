from typing import Any, Dict, Union

from fastapi import FastAPI
import bussin
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import demoUserScript
app = FastAPI()
class Manifest(BaseModel):
    manifest: Dict[Any, Union[Any, None]]
@app.get('/', response_class=HTMLResponse)
async def get_designer():
    return bussin.__get_designer()

@app.post("/eval")
async def create_item(manifest: Manifest):
    return bussin.__process_request(manifest.manifest)

