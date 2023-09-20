import os
import subprocess
import re


def java_compile(file_name):
    subprocess.run(f"javac {file_name}", shell=True, capture_output=True, text=True)

def java_run(class_name):
    stderr = subprocess.run(f"/usr/bin/time -v java {class_name}", shell=True, capture_output=True, text=True).stderr
    runtime_info = [x.replace('\t','').split(': ') for x in stderr.splitlines()]
    runtime_info = dict(runtime_info[1:])
    return runtime_info

def runtime_results(java_code):
    searched_class = re.findall("class ([A-Za-z0-9_]*) {", java_code)
    class_name =  searched_class[0]
    file_name = class_name + '.java'
    f = open(f"{file_name}", 'w')
    f.write(java_code)
    f.close()

    java_compile(file_name)
    runtime_info = java_run(class_name)

    if not os.path.exists(".old_java_code"):
        os.makedirs(".old_java_code")

    subprocess.run(f"mv {file_name} .old_java_code", shell=True, text=True)
    subprocess.run(f"mv {class_name}.class .old_java_code", shell=True, text=True)

    return(runtime_info)

