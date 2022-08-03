from typing import Dict

from fastapi import FastAPI
import bussin

app = FastAPI()



@app.post("/eval")
async def create_item(manifest: Dict):
    return bussin.__process_request(manifest)

