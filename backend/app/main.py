import sys
from typing import Union

from fastapi import FastAPI

sys.path.append("../green_algorithm")
from green_algorithm import GreenAlgorithm, GreenAlgorithmConstants

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/test_green_algorithm")
def test_green_algorithm():
    gc = GreenAlgorithmConstants()

    test_data_dict = {
        "constants": gc,
        "memory": 64,
        "n_cpu_cores": 4,
        "psf": 1.0,
        "pue_used": 1.67,
        "runtime_hours": 1,
        "runtime_minutes": 0,
        "tdp": 45,
        "tdp_per_core": 11.3,
        "usage_cpu_used": 1.0,
    }
    ga = GreenAlgorithm(test_data_dict)
    ce = ga.calculate_carbon_emissions()
    tm = ga.calculate_tree_months(ce["carbon_emissions"])
    dk = ga.calculate_driving_kilometers(ce["carbon_emissions"])
    return {"carbon_emissions": ce, "tree_months": tm, "driving_kilometers": dk}
