const express = require('express');
const routes = express.Router();

const dbProjects = require('../data/helpers/projectModel');

const projectsUrl = '/api/projects';
const projectsByIdUrl = '/api/projects/:id';
const projectActionsByIdUrl ='/api/projects/:id/actions'

routes.use(express.json());

/* 
GET ALL PROJECTS
[GET] no body or params required
 */
routes.get(projectsUrl, async (req, res) => {
  try {
    const projects = await dbProjects.get();
    if (projects.length > 0) {
      res.status(200).json(projects);
    } else {
      res.status(200).json({ message: 'There are currently no projects!' });
    }
  } catch (error) {
    res.status(500).json({ error: 'The projects could not be retrieved.' });
  }
});

/*
GET PROJECTS BY ID
[GET] a valid id should be passed in params
*/
routes.get(projectsByIdUrl, async (req, res) => {
  const { id } = req.params;
  try {
    const project = await dbProjects.get(id);
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(200).json({ message: 'This project does not exist!' });
    }
  } catch (error) {
    res.status(500).json({ error: 'The projects could not be retrieved.' });
  }
});

/*
GET ALL PROJECT ACTIONS BY ID
[GET] a valid project id should be passed in params
*/
routes.get(projectActionsByIdUrl, async (req, res) => {
    const { id } = req.params;
    try {
      const actions = await dbProjects.getProjectActions(id);
      if (actions.length > 0) {
        res.status(200).json(actions);
      } else {
        res.status(200).json({ message: 'There are no actions for this project!' });
      }
    } catch (error) {
      res.status(500).json({ error: 'The projects could not be retrieved.' });
    }
  });


/*
ADD A PROJECT
[POST] a valid body should be passed with:
name: string (required),
description: string	(required),
completed: boolean (optional)
*/
routes.post(projectsUrl, async (req, res) => {
  const project = req.body;
  if (project.name && project.description) {
    try {
      const newProject = await dbProjects.insert(project);
      res.status(201).json({ newProject });
    } catch (error) {
      res.status(500).json({ error: 'The project could not be added.' });
    }
  } else {
    res.status(404).json({
      message: 'please include a name and a description for your project',
    });
  }
});

/*
DELETE A PROJECT
supply a valid id in the param
*/
routes.delete(projectsByIdUrl, async (req, res) => {
  const { id } = req.params;
  try {
    const count = await dbProjects.remove(id);
    if (count) {
      res.status(200).json({ message: 'Project successfully deleted' });
    } else {
      res.status(404).json({ message: 'No project with this id exists' });
    }
  } catch (error) {
    res.status(500).json({ error: 'The project could not be removed.' });
  }
});

/*
UPDATE A PROJECT
supply a valid id in the param and a body containing and a body containing a resource to change, 1 of name, description, or completed
*/
routes.put(projectsByIdUrl, async (req, res) => {
  const { id } = req.params;
  const projectUpdates = req.body;
  if (
    projectUpdates.name ||
    projectUpdates.description ||
    projectUpdates.completed
  ) {
    try {
      const resource = await dbProjects.update(id, projectUpdates);
      if (resource) {
        res.status(200).json(resource);
      } else {
        res.status(404).json({ message: 'No project exists with this id' });
      }
    } catch (error) {
      res.status(500).json({ error: 'The project could not be updated.' });
    }
  } else {
    res
      .status(404)
      .json({
        message:
          'Please include an update to one of name, description, or completed',
      });
  }
});

module.exports = routes;
