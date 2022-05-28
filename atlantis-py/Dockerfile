FROM python:3.7.13

WORKDIR /usr/src/app

COPY requirements.txt .

RUN python3 -m pip install virtualenv --user
RUN python3 -m virtualenv .
RUN ./bin/pip install -r requirements.txt

COPY ./ ./

CMD ["./bin/python", "-m", "gunicorn", "--bind", "0.0.0.0:8090", "--timeout", "6000", "wsgi"]

