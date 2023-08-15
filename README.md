This is a simple todo app serving as a proof of concept for using next & sqlite in a single docker container.

## Running with docker

```bash
docker build -t todo-next-docker-sqlite .
docker run -it --rm -p 3000:3000 todo-next-docker-sqlite
```

Data can be persisted between runs by mounting a volume or local directory to `target=/data`

```bash
docker run -it --rm -p 3000:3000 --mount source=todo-data,target=/data
```
