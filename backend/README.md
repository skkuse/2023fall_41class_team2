# 📌 Backend 개발현황

- [x] 개발환경 구축
- [x] java 컴파일 및 실행 모듈 구축
- [x] 탄소 계산 알고리즘 & 모듈 구축
- [x] Fast API 에 각 모듈 연결
- [ ] 클라우드 서버 가동

# 🚀 컨테이너 실행 및 종료 옵션

```bash
# backend 폴더에서 진행
cd backend

# 컨테이너 포함 전체 서비스 실행
docker-compose -f docker-compose.local.yml up
# docker-compose -f docker-compose.local.yml up --build (Dockerfile에 변동사항이 생겼을때)

# 전체 서비스 정지 및 컨테이너 삭제
docker-compose -f docker-compose.local.yml down
# docker-compose -f docker-compose.local.yml down -v (사용자 별 java 구동 컨테이너 볼륨까지 제거)
```

# 📜 Backend 개발환경 구축 가이드

Docker 구축 혹은 Ubuntu 직접 구축 중 하나를 선택해서 진행하세요.

## (방법 1) Docker 환경 구축

원하는 운영체제에 docker를 설치합니다.
이후 다음 절차를 통해 컨테이너를 생성합니다.

```bash
docker build -t <원하는 이미지 이름> <dockerfile 위치>
docker run -it --name <원하는 컨테이너 이름> <앞서 만든 이미지 이름>
```

컨테이너 구축 이후 `git clone`으로 repo를 복사하고, 원하는 branch로 바꿉니다. 현재 예시로는 `feature/add-java-exec-module`을 사용합니다.  
실제 개발을 위해서는 `docker run -v` 옵션을 통해 호스트의 프로젝트 폴더를 볼륨으로 사용하는걸 추천합니다.

```bash
git clone https://github.com/skkuse/2023fall_41class_team2
git checkout -t remotes/origin/feature/add-java-exec-module
```

이후 `backend` 폴더에서 pipenv 환경을 구축하고 shell을 열어 실행해봅니다.

```bash
pipenv install
pipenv shell
uvicorn main:app --reload
```

정상적으로 실행이 되었다면 다음 사이트에 접속해 API를 확인합니다.

http://127.0.0.1:8000/docs

## (방법 2) Ubuntu 직접 구축

### 권장 개인 환경

해당 항목들은 사전에 설치 & 준비 바랍니다.

- Ubuntu 22.04
- java jdk 17
- python 3.10.12
- pipenv 패키지

<br>

java jdk 17 설치 안내:

```
sudo apt install openjdk-17-jdk
```

실제 자바 코드의 실행을 위해 필요합니다.
만약, 서버 실행시 오류가 발생한다면 자바 컴파일 및 실행의 권한 문제일수도 있습니다. 해당 경우에는 아래와 같이 시도해보세요.

```
sudo vi /etc/environment
```

```
#아래와 같이 수정
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
```

### pipenv 환경

관련 설명 사이트(필독): https://www.daleseo.com/python-pipenv/

`/backend` 폴더에 pipenv에 필요한 Pipfile, Pipfile.lock 파일이 있습니다.
해당 파일들은 본 프로젝트에 필요한 패키지, 파이썬 버전등을 담고있습니다. 아래의 명령어를 통해 설치 가능 합니다.

```
pipenv install
```

가상환경의 시작은 다음 명령어로 가능합니다.

```
pipenv shell
```

pipenv 설치 후 오류가 발생할 경우 다음을 시도해보세요.

```
#pipenv 명령어가 불가능 할때
python3 -m pipenv shell
```

```
#위의 것이 안될 경우 pipenv 옵션 재설치
sudo -H pip install -U pipenv
```

```
#pip 에서 계속 오류가 발생하는 경우, apt 시도
sudo apt install pipenv
```

## FastAPI 서버 실행

```
#개발 테스트
uvicorn main:app --reload
```

```
#Azure 가상머신에서 고정 주소로 오픈(최종). 단, port 리다이렉션 필요
uvicorn main:app --reload --host=0.0.0.0 --port=8080
```

API 문서와 테스트는 다음 사이트에서 확인가능 합니다.
단, 테스트는 1 에서만 가능.

1. http://127.0.0.1:8000/docs

2. http://127.0.0.1:8000/redoc

Azure 가상머신 주소

http://skku.koreacentral.cloudapp.azure.com/

Azure 서버는 아직 백그라운드 실행은 지원하지 않습니다. 추후 gunicorn 으로 지원예정.
