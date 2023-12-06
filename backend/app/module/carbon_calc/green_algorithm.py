import os
import sys

from dataclasses import dataclass, field

import pandas as pd

# root/data/lateset/foo.csv
DATA_DIR = os.path.join(os.path.dirname(__file__), "data", "latest")


def load_and_preprocess_csv(
    csv_path: str, drop_column: str, index_column: str, data_column: str
) -> (pd.DataFrame, dict):
    df = pd.read_csv(csv_path, sep=",", skiprows=1).drop(drop_column, axis=1)
    dt = pd.Series(
        df.loc[:, data_column].values, index=df.loc[:, index_column]
    ).to_dict()
    return df, dt


def print_with_title(func):
    def wrapper(*args, **kwargs):
        print()


@dataclass(frozen=True)
class GreenAlgorithmConstants:
    pue_df, pue_default_dict = load_and_preprocess_csv(
        os.path.join(DATA_DIR, "defaults_PUE.csv"), "source", "provider", "PUE"
    )
    cpu_df, cpu_dict = load_and_preprocess_csv(
        os.path.join(DATA_DIR, "TDP_cpu.csv"), "source", "model", "TDP_per_core"
    )
    ref_values_df, ref_values_dict = load_and_preprocess_csv(
        os.path.join(DATA_DIR, "referenceValues.csv"),
        "source",
        "variable",
        "value",
    )
    carbon_intensity_dict = {"KR": 415.6}


@dataclass
class GreenAlgorithmFields:
    constants: GreenAlgorithmConstants
    pue_used: float

    # CPU DATA
    n_cpu_cores: float
    tdp: int
    tdp_per_core: float
    usage_cpu_used: float  # 1.0

    # MEMORY DATA
    memory: float
    psf: float  # 1.0

    # RUNTIME DATA
    runtime_hours: float  # hours
    runtime_minutes: float  # minutes
    runtime_seconds: float  # seconds
    runtime: float = None

    def __init__(self, **kwargs) -> None:
        self.__dict__.update(kwargs)
        self.__post_init__()  # explictly call __post_init__ because of custom init

    def __post_init__(self) -> None:
        self.runtime = (
            self.runtime_hours
            + self.runtime_minutes / 60
            + self.runtime_seconds / (60 * 60)
        )


class GreenAlgorithm:
    def __init__(self, data_dict: dict) -> None:
        self.ga_data = GreenAlgorithmFields(**data_dict)

    def get_green_algorithm_fields(self) -> GreenAlgorithmFields:
        return self.ga_data

    def set_green_algorithm_fields(
        self, green_algorithm_fields: GreenAlgorithmFields
    ) -> None:
        self.ga_data = green_algorithm_fields

    def update_green_algorithm_fields(self, **kwargs) -> None:
        self.ga_data.__dict__.update(kwargs)

    def _calculate_power_needed_data(self) -> dict:
        result_dict = {}
        result_dict["power_needed_cpu"] = (
            self.ga_data.pue_used
            * self.ga_data.tdp_per_core
            * self.ga_data.usage_cpu_used
            # n_cpu_cores is combined with usage_cpu_used
        )
        result_dict["power_needed_gpu"] = 0
        result_dict["power_needed_core"] = (
            result_dict["power_needed_cpu"] + result_dict["power_needed_gpu"]
        )
        result_dict["power_needed_memory"] = self.ga_data.pue_used * (
            self.ga_data.memory
            / (1024 * 1024)
            * self.ga_data.constants.ref_values_dict["memoryPower"]
        )
        result_dict["power_needed"] = (
            result_dict["power_needed_core"] + result_dict["power_needed_memory"]
        )
        return result_dict

    def _calculate_power_energy_needed_data(self) -> dict:
        result_dict = {}
        power_dict = self._calculate_power_needed_data()
        result_dict["energy_needed_cpu"] = (
            self.ga_data.runtime
            * power_dict["power_needed_cpu"]
            * self.ga_data.psf
            / 1000
        )
        result_dict["energy_needed_gpu"] = 0
        result_dict["energy_needed_core"] = (
            self.ga_data.runtime
            * power_dict["power_needed_core"]
            * self.ga_data.psf
            / 1000
        )
        result_dict["energy_needed_memory"] = (
            self.ga_data.runtime
            * power_dict["power_needed_memory"]
            * self.ga_data.psf
            / 1000
        )
        result_dict["energy_needed"] = (
            self.ga_data.runtime * power_dict["power_needed"] * self.ga_data.psf / 1000
        )
        result_dict.update(power_dict)
        return result_dict

    def calculate_carbon_emissions(self) -> dict:
        result_dict = {}
        power_energy_result_dict = self._calculate_power_energy_needed_data()
        result_dict["carbon_emissions_cpu"] = (
            power_energy_result_dict["energy_needed_cpu"]
            * self.ga_data.constants.carbon_intensity_dict["KR"]
        )
        result_dict["carbon_emissions_gpu"] = 0
        result_dict["carbon_emissions_core"] = (
            power_energy_result_dict["energy_needed_core"]
            * self.ga_data.constants.carbon_intensity_dict["KR"]
        )
        result_dict["carbon_emissions_memory"] = (
            power_energy_result_dict["energy_needed_memory"]
            * self.ga_data.constants.carbon_intensity_dict["KR"]
        )
        result_dict["carbon_emissions"] = (
            power_energy_result_dict["energy_needed"]
            * self.ga_data.constants.carbon_intensity_dict["KR"]
        )
        result_dict.update(power_energy_result_dict)
        return result_dict

    def calculate_tree_months(self, carbon_emissions: float) -> float:
        return (
            carbon_emissions / self.ga_data.constants.ref_values_dict["treeYear"] * 12
        )

    def calculate_driving_kilometers(self, carbon_emissions: float) -> dict:
        result_dict = {}
        result_dict["us_nkm"] = (
            carbon_emissions
            / self.ga_data.constants.ref_values_dict["passengerCar_US_perkm"]
        )
        result_dict["eu_nkm"] = (
            carbon_emissions
            / self.ga_data.constants.ref_values_dict["passengerCar_EU_perkm"]
        )
        if (
            carbon_emissions
            < 0.5 * self.ga_data.constants.ref_values_dict["flight_NY-SF"]
        ):
            result_dict["flying_context"] = (
                carbon_emissions
                / self.ga_data.constants.ref_values_dict["flight_PAR-LON"]
            )
            result_dict["flying_text"] = "Paris-London"
        elif (
            carbon_emissions
            < 0.5 * self.ga_data.constants.ref_values_dict["flight_NYC-MEL"]
        ):
            result_dict["flying_context"] = (
                carbon_emissions
                / self.ga_data.constants.ref_values_dict["flight_NY-SF"]
            )
            result_dict["flying_text"] = "NYC-San Francisco"
        else:
            result_dict["flying_context"] = (
                carbon_emissions
                / self.ga_data.constants.ref_values_dict["flight_NYC-MEL"]
            )
            result_dict["flying_text"] = "NYC-Melbourne"

        return result_dict

    def carbon_calc_results(self) -> dict:
        ce = self.calculate_carbon_emissions()
        tm = self.calculate_tree_months(ce["carbon_emissions"])
        dk = self.calculate_driving_kilometers(ce["carbon_emissions"])

        return {
            "carbon_emissions": ce["carbon_emissions"],
            "energy_needed": ce["energy_needed"],
            "tree_month": tm,
            "driving_length_us": dk["us_nkm"],
            "driving_length_eu": dk["eu_nkm"],
            "flying_path": dk["flying_text"],
            "flying_ratio": dk["flying_context"],
        }
