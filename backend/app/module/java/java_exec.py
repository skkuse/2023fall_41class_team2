import os
import subprocess
import re


class UserContainer:
    def __init__(self, java_code: str, uid: str):
        # User java code
        self.java_code = java_code
        # User uuid - used for container name and identification.
        self.uid = uid
        # Code execution results
        self.runtime_info = {
            "cpu_core_use": -1,
            "memory_usage": -1,
            "user_time": -1,
            "compile_stderr": "",
            "runtime_stdout": "",
            "runtime_stderr": "",
        }

        # Get ENV value from docker os
        self.USER_VOLUME_PATH = os.environ["USER_VOLUME_PATH"]
        self.CONTAINER_PROFILE_PATH = os.environ["CONTAINER_PROFILE_PATH"]
        self.SCRIPT_FILE_NAME = os.environ["SCRIPT_FILE_NAME"]
        self.USER_CONTAINER_NAME = os.environ["USER_CONTAINER_NAME"]
        self.SHARED_VOLUME_NAME = os.environ["SHARED_VOLUME_NAME"]
        self.COMPILE_STDERR_FILE_NAME = os.environ["COMPILE_STDERR_FILE_NAME"]
        self.RUNTIME_ANALYSIS_FILE_NAME = os.environ["RUNTIME_ANALYSIS_FILE_NAME"]
        self.RUNTIME_STDERR_FILE_NAME = os.environ["RUNTIME_STDERR_FILE_NAME"]
        self.RUNTIME_STDOUT_FILE_NAME = os.environ["RUNTIME_STDOUT_FILE_NAME"]
        self.ENV_PATH = os.environ["ENV_PATH"]
        self.USER_ENV_FILE_NAME = os.environ["USER_ENV_FILE_NAME"]
        self.LOCAL_ENV_FILE_NAME = os.environ["LOCAL_ENV_FILE_NAME"]

    def shell_run(self, cmd: str) -> object:
        return subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
        )

    def forwarding_user_file(self) -> None:
        user_path = f"{self.USER_VOLUME_PATH}/{self.uid}"

        if not os.path.exists(user_path):
            os.makedirs(user_path)

        self.shell_run(
            f"cp {self.CONTAINER_PROFILE_PATH}/{self.SCRIPT_FILE_NAME} {user_path}"
        )

        searched_classes = re.findall(
            "public class ([A-Za-z0-9_\s]*){|class ([A-Za-z0-9_\s]*){", self.java_code
        )
        if not searched_classes:
            print("ERROR: Class name does not exist.")
            return

        class_name = searched_classes[0][0].strip() or searched_classes[0][1].strip()

        with open(f"{user_path}/{class_name}.java", "w") as f:
            f.write(self.java_code)

    def run_code(self) -> None:
        print(f"@DEV:     Run user[{self.uid}] container ...")

        docker_options = {
            "--rm": "",
            "--name": f"user-{self.uid}",
            "-v": f"{self.SHARED_VOLUME_NAME}:{self.USER_VOLUME_PATH}",
            "--env-file": f"{self.ENV_PATH}/{self.USER_ENV_FILE_NAME}",
            f"{self.USER_CONTAINER_NAME}": "",
            "python3": f"{self.USER_VOLUME_PATH}/{self.uid}/{self.SCRIPT_FILE_NAME} {self.uid}",
        }

        cmd = "docker run " + " ".join(f"{k} {v}" for k, v in docker_options.items())
        result = self.shell_run(cmd)

        print(f"@DEV:     Run user[{self.uid}] success")

    def read_results(self) -> dict:
        with open(
            f"{self.USER_VOLUME_PATH}/{self.uid}/{self.COMPILE_STDERR_FILE_NAME}", "r"
        ) as f:
            compile_stderr = f.read()
            self.runtime_info["compile_stderr"] = compile_stderr

            if compile_stderr:
                return self.runtime_info

        with open(
            f"{self.USER_VOLUME_PATH}/{self.uid}/{self.RUNTIME_STDERR_FILE_NAME}", "r"
        ) as f:
            runtime_stderr = f.read()
            self.runtime_info["runtime_stderr"] = runtime_stderr

        with open(
            f"{self.USER_VOLUME_PATH}/{self.uid}/{self.RUNTIME_STDOUT_FILE_NAME}", "r"
        ) as f:
            runtime_stdout = f.read()
            self.runtime_info["runtime_stdout"] = runtime_stdout

        with open(
            f"{self.USER_VOLUME_PATH}/{self.uid}/{self.RUNTIME_ANALYSIS_FILE_NAME}", "r"
        ) as f:
            runtime_analysis_raw = f.read()

        runtime_analysis = [
            x.replace("\t", "").split(": ") for x in runtime_analysis_raw.splitlines()
        ]

        essential_analysis_key = {
            "User time (seconds)": "user_time",
            "Percent of CPU this job got": "cpu_core_use",
            "Maximum resident set size (kbytes)": "memory_usage",
        }

        for feature in runtime_analysis:
            if feature[0] in essential_analysis_key:
                self.runtime_info[essential_analysis_key[feature[0]]] = feature[1]

        self.runtime_info["cpu_core_use"] = (
            float(self.runtime_info["cpu_core_use"][:-1]) / 100
        )
        self.runtime_info["memory_usage"] = float(self.runtime_info["memory_usage"])
        self.runtime_info["user_time"] = float(self.runtime_info["user_time"])

        return self.runtime_info
