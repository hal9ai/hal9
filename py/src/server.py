from typing import Any, Dict, Union
import json
from fastapi import FastAPI
import bussin
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import demoUserScript
app = FastAPI()

class Manifest(BaseModel):
    manifest: Dict[Any, Union[Any, None]]

@app.get('/pipeline')
async def get_pipeline():
    with open('../../inst/pipeline.json') as f:
        return f.read()
        
@app.get('/', response_class=HTMLResponse)
async def run_client():
    return bussin.__get_designer(mode = "run")

@app.get('/design', response_class=HTMLResponse)
async def get_designer():
    return bussin.__get_designer(mode = "design")

@app.post("/eval")
async def create_item(manifest: Manifest):
    return bussin.__process_request(manifest.manifest)

