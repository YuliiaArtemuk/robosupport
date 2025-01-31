FROM python:3.10.9

WORKDIR /app
COPY requirements.txt /app

RUN pip install --no-cache -r requirements.txt

COPY app app
ENV PYTHONPATH='/'

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

