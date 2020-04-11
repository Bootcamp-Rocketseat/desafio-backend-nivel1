const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyRepository(request, response, next) {
  const { id } = request.params

  const repoIndex = repositories.findIndex(value => value.id === id)

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' })
  }

  request.params.index = repoIndex

  return next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const repo = {
    ...request.body,
    likes: 0,
    id: uuid()
  }
  repositories.push(repo)

  return response.json(repo)
});

app.put("/repositories/:id", verifyRepository, (request, response) => {
  const { id, index } = request.params
  const { title, url, techs } = request.body

  console.log(index)

  const repository = {
    id,
    likes: repositories[index].likes,
    title,
    url,
    techs
  }

  repositories[index] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", verifyRepository, (request, response) => {
  const { index } = request.params

  repositories.splice(index, 1)
  return response.status(204).json({})
});

app.post("/repositories/:id/like", verifyRepository, (request, response) => {
  const { index } = request.params

  repositories[index].likes += 1

  return response.json(repositories[index])
});

module.exports = app;
