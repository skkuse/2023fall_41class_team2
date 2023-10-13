import os
import subprocess
import re


def java_compile(file_name):
    subprocess.run(f"javac {file_name}", shell=True, capture_output=True, text=True)

def java_run(class_name):
    stderr = subprocess.run(f"/usr/bin/time -v java {class_name}", shell=True, capture_output=True, text=True).stderr
    runtime_info = [x.replace('\t','').split(': ') for x in stderr.splitlines()]

    essential_info_key = {
        'User time (seconds)': 'user_time',
        'Percent of CPU this job got': 'cpu_percent',
        'Average total size (kbytes)': 'memory_usage',
    }
    info_types = essential_info_key.keys()

    essential_info = {}

    for k in runtime_info:
        if k[0] in info_types:
            essential_info[essential_info_key[k[0]]] = k[1]

    return essential_info

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

