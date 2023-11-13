import os
import subprocess
import re

USER_VOLUME_PATH = os.environ["USER_VOLUME_PATH"]
CONTAINER_PROFILE_PATH = os.environ["CONTAINER_PROFILE_PATH"]
SCRIPT_FILE_NAME = os.environ["SCRIPT_FILE_NAME"]
USER_CONTAINER_NAME = os.environ["USER_CONTAINER_NAME"]
SHARED_VOLUME_NAME = os.environ["SHARED_VOLUME_NAME"]
COMPILE_STDERR_FILE_NAME = os.environ["COMPILE_STDERR_FILE_NAME"]
RUNTIME_ANALYSIS_FILE_NAME = os.environ["RUNTIME_ANALYSIS_FILE_NAME"]
RUNTIME_STDERR_FILE_NAME = os.environ["RUNTIME_STDERR_FILE_NAME"]
RUNTIME_STDOUT_FILE_NAME = os.environ["RUNTIME_STDOUT_FILE_NAME"]
ENV_PATH = os.environ["ENV_PATH"]
USER_ENV_FILE_NAME = os.environ["USER_ENV_FILE_NAME"]
LOCAL_ENV_FILE_NAME = os.environ["LOCAL_ENV_FILE_NAME"]


def shell_run(cmd: str) -> object:
    return subprocess.run(
        cmd,
        shell=True,
        capture_output=True,
        text=True,
    )


def prepare_user_file(uid, java_code) -> None:
    user_path = f"{USER_VOLUME_PATH}/{uid}"

    if not os.path.exists(user_path):
        os.makedirs(user_path)

    shell_run(f"cp {CONTAINER_PROFILE_PATH}/{SCRIPT_FILE_NAME} {user_path}")

    searched_class = re.findall("class ([A-Za-z0-9_]*) {", java_code)
    class_name = searched_class[0]

    f = open(f"{user_path}/{class_name}.java", "w")
    f.write(java_code)
    f.close()


def container_forwarding(uid) -> None:
    print(f"@DEV:     Run user[{uid}] container ...")

    docker_options = {
        "docker": "run",
        "--rm": "",
        "--name": f"user-{uid}",
        "-v": f"{SHARED_VOLUME_NAME}:{USER_VOLUME_PATH}",
        "--env-file": f"{ENV_PATH}/{USER_ENV_FILE_NAME}",
        f"{USER_CONTAINER_NAME}": "",
        "python3": f"{USER_VOLUME_PATH}/{uid}/{SCRIPT_FILE_NAME} {uid}",
    }

    cmd = " ".join(f"{k} {v}" for k, v in docker_options.items())
    result = shell_run(cmd)

    print(f"@DEV:     User:[{uid}] container run succese")


def read_container_log(uid) -> dict:
    runtime_info = {
        "cpu_core_use": -1,
        "memory_usage": -1,
        "user_time": -1,
        "compile_stderr": "",
        "runtime_stdout": "",
        "runtime_stderr": "",
    }

    f = open(f"{USER_VOLUME_PATH}/{uid}/{COMPILE_STDERR_FILE_NAME}", "r")
    compile_stderr = f.read()
    f.close()

    runtime_info["compile_stderr"] = compile_stderr

    if compile_stderr:
        return runtime_info

    f = open(f"{USER_VOLUME_PATH}/{uid}/{RUNTIME_STDERR_FILE_NAME}", "r")
    runtime_stderr = f.read()
    f.close()

    runtime_info["runtime_stderr"] = runtime_stderr

    f = open(f"{USER_VOLUME_PATH}/{uid}/{RUNTIME_STDOUT_FILE_NAME}", "r")
    runtime_stdout = f.read()
    f.close()

    runtime_info["runtime_stdout"] = runtime_stdout

    f = open(f"{USER_VOLUME_PATH}/{uid}/{RUNTIME_ANALYSIS_FILE_NAME}", "r")
    runtime_analysis_raw = f.read()
    f.close()

    runtime_analysis = [
        x.replace("\t", "").split(": ") for x in runtime_analysis_raw.splitlines()
    ]

    essential_analysis_key = {
        "User time (seconds)": "user_time",
        "Percent of CPU this job got": "cpu_core_use",
        "Maximum resident set size (kbytes)": "memory_usage",
    }

    for k in runtime_analysis:
        if k[0] in essential_analysis_key:
            runtime_info[essential_analysis_key[k[0]]] = k[1]

    # core percent -> core num
    runtime_info["cpu_core_use"] = float(runtime_info["cpu_core_use"][:-1]) / 100
    # KB
    runtime_info["memory_usage"] = float(runtime_info["memory_usage"])
    # sec
    runtime_info["user_time"] = float(runtime_info["user_time"])

    return runtime_info


def runtime_results(java_code, uid) -> dict:
    prepare_user_file(uid, java_code)
    container_forwarding(uid)
    runtime_info = read_container_log(uid)

    return runtime_info
