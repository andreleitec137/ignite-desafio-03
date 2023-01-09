const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepository(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);
  
  if(!repository) {
      return response.status(404).json({
          error: "Repositório não encontrado!"
      });
  }

  request.repository = repository;

  return next();
}


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", checksExistsRepository, (request, response) => {
  const updatedRepository = request.body;
  const { repository } = request;

  if(updatedRepository.url) repository.url = updatedRepository.url

  if(updatedRepository.title) repository.title = updatedRepository.title

  if(updatedRepository.techs) repository.techs = updatedRepository.techs

  return response.status(201).json(repository);
});

app.delete("/repositories/:id", checksExistsRepository, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsRepository, (request, response) => {
  const { id } = request.params;
  const { repository } = request;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repository.likes = repository.likes + 1;

  return response.json({'likes': repository.likes});
});

module.exports = app;
