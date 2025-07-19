FROM python:3.11-alpine AS base

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

RUN apk update && apk add libpq

FROM base AS builder

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

RUN apk update && apk add musl-dev build-base gcc gfortran openblas-dev

WORKDIR /app

RUN pip install poetry==1.8.2

COPY pyproject.toml poetry.lock ./

RUN poetry install --with dev --no-root && rm -rf $POETRY_CACHE_DIR

FROM base AS runtime

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

WORKDIR /app
