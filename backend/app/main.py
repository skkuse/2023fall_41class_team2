from typing import Union, Annotated
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from module import java_exec

app = FastAPI()


class Code(BaseModel):
    req_code: str

@app.get("/")
def read_root():
    return {"info":"Welcome SWE2023 Team2!"}

@app.post("/run_java")
def run_java(
    code: Annotated [
        Code,
        Body(
            examples=[
                {
                    "req_code":  
                    """public class HelloSKKU { public static void main(String[ ] args) { System.out.println("Hello SKKU!"); }}"""
                }
            ],
        ),
    ],
):
    dicted_code = dict(code)
    java_code = dicted_code['req_code']
    runtime_info = java_exec.runtime_results(java_code)

    return(runtime_info)
