import sys
import os
import subprocess

USER_VOLUME_PATH = os.environ["USER_VOLUME_PATH"]
COMPILE_STDERR_FILE_NAME = os.environ["COMPILE_STDERR_FILE_NAME"]
RUNTIME_ANALYSIS_FILE_NAME = os.environ["RUNTIME_ANALYSIS_FILE_NAME"]
RUNTIME_STDERR_FILE_NAME = os.environ["RUNTIME_STDERR_FILE_NAME"]
RUNTIME_STDOUT_FILE_NAME = os.environ["RUNTIME_STDOUT_FILE_NAME"]


def shell_run(cmd: str) -> object:
    return subprocess.run(
        cmd,
        shell=True,
        capture_output=True,
        text=True,
    )


def main():
    uid = sys.argv[1]
    user_path = f"{USER_VOLUME_PATH}/{uid}"

    searched_class = [x for x in os.listdir(user_path) if x.endswith(".java")]
    class_name = searched_class[0][:-5] if searched_class else None

    if not class_name:
        return

    compile_result = shell_run(f"javac {user_path}/{class_name}.java")
    compile_stderr = compile_result.stderr

    f = open(f"{user_path}/{COMPILE_STDERR_FILE_NAME}", "w")
    f.write(compile_stderr)
    f.close()

    if compile_stderr:
        return

    runtime_result = shell_run(
        f"cd {user_path} && /usr/bin/time -o {RUNTIME_ANALYSIS_FILE_NAME} -v java {class_name}"
    )

    runtime_stderr = runtime_result.stderr
    runtime_stdout = runtime_result.stdout

    f = open(f"{user_path}/{RUNTIME_STDERR_FILE_NAME}", "w")
    f.write(runtime_stderr)
    f.close()

    f = open(f"{user_path}/{RUNTIME_STDOUT_FILE_NAME}", "w")
    f.write(runtime_stdout)
    f.close()


if __name__ == "__main__":
    main()
