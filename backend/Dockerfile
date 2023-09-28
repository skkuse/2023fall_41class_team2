FROM ubuntu:22.04

# Install basic
RUN apt-get update -y && \ 
    apt-get install -y \
    software-properties-common \
    git \
    time

# Install Python 3.10
RUN add-apt-repository ppa:deadsnakes/ppa -y && \
    apt-get update -y && \
    apt-get install -y \
	python3.10 \
	python3-pip

# Install pipenv
RUN pip install pipenv

# Install JDK 17
RUN apt-get install openjdk-17-jdk -y

# Test version
RUN java -version && python3 --version

CMD ["bash"]