import sys
from typing import Union, Annotated
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from module.java import java_exec
from module.carbon_calc.green_algorithm import GreenAlgorithm, GreenAlgorithmConstants

app = FastAPI()


class Code(BaseModel):
    req_code: str


@app.get("/")
def read_root():
    return {"info": "Welcome SWE2023 Team2!"}


@app.post("/carbon_emission_calculate")
def carbon_emission_calculate(
    code: Annotated[
        Code,
        Body(
            examples=[
                {
                    "req_code": """public class HelloSKKU { public static void main(String[ ] args) { for(i = 0; i < 1000000000; i++){ System.out.println("Hello SKKU!");}}}"""
                }
            ],
        ),
    ],
):
    dicted_code = dict(code)
    java_code = dicted_code["req_code"]
    runtime_info = java_exec.runtime_results(java_code)

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

    carbon_emission_info = GreenAlgorithm(test_data_dict).carbon_calc_results()

    combined_info = dict(carbon_emission_info, **runtime_info)

    return combined_info
