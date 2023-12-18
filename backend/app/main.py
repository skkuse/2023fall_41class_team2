import sys
from typing import Union, Annotated
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from module.java.java_exec import UserContainer
from module.carbon_calc.green_algorithm import GreenAlgorithm, GreenAlgorithmConstants
from fastapi.middleware.cors import CORSMiddleware
import uuid

app = FastAPI()

origins = [
    "http://ecode-buck.s3-website.ap-northeast-2.amazonaws.com",
    "https://ecode.life",
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Code(BaseModel):
    req_code: str


@app.get("/")
def read_root():
    return {"info": "Welcome SWE2023 Team2!"}


@app.post("/api/carbon_emission_calculate")
def carbon_emission_calculate(
    # sample code for Fastapi docs api test
    code: Annotated[
        Code,
        Body(
            examples=[
                {
                    "req_code": """public class HelloSKKU { public static void main(String[ ] args) { for(int i = 0; i < 10; i++){ System.out.println("Hello SKKU!"); System.err.println("Bye SKKU!");}}}"""
                }
            ],
        ),
    ],
):
    # Unique uuid allocation for each user
    # uuid is used for container name and identification.
    uid = str(uuid.uuid1())

    # Extract Java code from request
    dicted_code = dict(code)
    java_code = dicted_code["req_code"]

    # Creating a UserContainer Instance
    user_container = UserContainer(java_code, uid)
    # Run code in Container and get result
    user_container.forwarding_user_file()
    user_container.run_code()
    runtime_info = user_container.read_results()

    # memory, runtime_minutes, usage_cpu_used values are given by java_exec module
    # some value is hardcoded because of Hardware diff
    test_data_dict = {
        "constants": GreenAlgorithmConstants(),
        "memory": runtime_info["memory_usage"],
        # n_cpu_cores is combined with usage_cpu_used
        "psf": 1.0,
        "pue_used": 1.67,
        # not use hour and min
        "runtime_hours": 0,
        "runtime_minutes": 0,
        "runtime_seconds": runtime_info["user_time"],
        "tdp": 45,
        "tdp_per_core": 11.3,
        "usage_cpu_used": runtime_info["cpu_core_use"],
    }
    # Creating a GreenAlgorithm(carbon emission calculator) Instance
    carbon_emission_calculator = GreenAlgorithm(test_data_dict)
    # Get calculated result
    carbon_emission_info = carbon_emission_calculator.carbon_calc_results()
    # Combine with runtime_info to return results
    combined_info = dict(carbon_emission_info, **runtime_info)

    return combined_info
