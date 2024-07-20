FROM python:3.11.9-slim-bullseye

ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

# VOLUME /app
# VOLUME /web/static
# VOLUME /web/media

WORKDIR /app

EXPOSE 8000

COPY app /app
COPY script /script 

RUN apt-get update && apt-get -y dist-upgrade && \
    apt-get install -y libpq5 && \
    apt-get install -y netcat && \
    python -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install -r requirements.txt && \
    mkdir -p /web/static && \
    mkdir -p /web/media && \
    chmod -R 755 /venv && \
    chmod -R 755 /web/static && \
    chmod -R 755 /web/media && \
    chmod -R +x /script    


ENV PATH="/app:/script:/venv/bin:$PATH"

CMD ["commands.sh"]