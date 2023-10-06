import unittest

from green_algorithm import GreenAlgorithm, GreenAlgorithmConstants

class TestGreenAlgorithm(unittest.TestCase):
    def __init__(self, methodName: str = "runTest") -> None:
    # def setUp(self) -> None:
        # return super().setUp()
        super().__init__(methodName=methodName)
        self.gc = GreenAlgorithmConstants()
        self.data_dict = {
        "constants": self.gc,
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
        self.ga = GreenAlgorithm(self.data_dict)
        self.ga_data = self.ga.get_green_algorithm_fields()
        self.ce_example = 47.91735008

        # lazy import for avoid blocking test
        try:
            import pprint
            self.print_func = pprint.pprint
        # not use pprint
        except ImportError:
            self.print_func = print

    def test_calculate_carbon_emission(self):
        ce = self.ga.calculate_carbon_emissions()
        self.print_func(ce)
        self.assertAlmostEqual(ce["carbon_emissions"], 47, delta=1)

    def test_calculate_tree_months(self):
        tm = self.ga.calculate_tree_months(self.ce_example)
        self.print_func(tm)
        self.assertAlmostEqual(tm, 0, delta=2)

    def test_calculate_driving_kilometers(self):
        dk = self.ga.calculate_driving_kilometers(self.ce_example)
        self.print_func(dk)
        self.assertAlmostEqual(dk["us_nkm"], 0.05,delta=0.001)
        # self.asser

if __name__ == "__main__":
    unittest.main()