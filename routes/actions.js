const express = require('express');
const routes = express.Router();

const dbActions = require('../data/helpers/actionModel');
const dbProjects = require('../data/helpers/projectModel');

const actionsUrl = '/api/actions';
const actionsByIdUrl = '/api/actions/:id';

routes.use(express.json());

/* 
GET ALL ACTIONS
[GET] no body or params required
 */
routes.get(actionsUrl, async (req, res) => {
  try {
    const actions = await dbActions.get();
    if (actions.length > 0) {
      res.status(200).json(actions);
    } else {
      res.status(200).json({ message: 'There are currently no actions!' });
    }
  } catch (error) {
    res.status(500).json({ error: 'The actions could not be retrieved.' });
  }
});

/*
GET ACTIONS BY ID
[GET] a valid id should be passed in params
*/
routes.get(actionsByIdUrl, async (req, res) => {
  const { id } = req.params;
  try {
    const action = await dbActions.get(id);
    if (action) {
      res.status(200).json(action);
    } else {
      res.status(200).json({ message: 'This action does not exist!' });
    }
  } catch (error) {
    res.status(500).json({ error: 'The actions could not be retrieved.' });
  }
});

/*
ADD AN ACTION
[POST] a valid body should be passed with:
project_id: number (required - must be an existing project),
description: string	(required, up to 120 characters),
notes: string (required, no size limit),
completed: boolean (optional)
*/
routes.post(actionsUrl, async (req, res) => {
  const action = req.body;
  const { project_id } = req.body;
  if (
    action.project_id &&
    action.description &&
    action.description.length < 128 &&
    action.notes
  ) {
    try {
      const projectValidator = await dbProjects.get(project_id);
      if (projectValidator) {
        try {
          const updatedAction = await dbActions.insert(action);
          res.status(201).json(updatedAction);
        } catch (error) {
          res.status(500).json({ message: 'The action could not be added' });
        }
      }
    } catch (error) {
      res.status(404).json({
        message: 'Please ensure you have a a valid project id',
      });
    }
  } else {
    res.status(404).json({ message: 'Please make sure your entry includes a description (less than 128 chars), notes, and a valid project_id' });
  }
});

/*
DELETE AN ACTION
supply a valid id in the param
*/
routes.delete(actionsByIdUrl, async (req, res) => {
    const { id } = req.params;
    try {
      const count = await dbActions.remove(id);
      if (count) {
        res.status(200).json({ message: 'Action successfully deleted' });
      } else {
        res.status(404).json({ message: 'No action with this id exists' });
      }
    } catch (error) {
      res.status(500).json({ error: 'The action could not be removed.' });
    }
  });

/*
UPDATE AN ACTION
supply a valid id in the param and a body containing and a body containing a resource to change, 1 of description, notes, or completed
*/
routes.put(actionsByIdUrl, async (req, res) => {
    const { id } = req.params;
    const actionUpdates = req.body;
    if (
      actionUpdates.description ||
      actionUpdates.notes ||
      actionUpdates.completed
    ) {
      try {
        const resource = await dbActions.update(id, actionUpdates);
        if (resource) {
          res.status(200).json(resource);
        } else {
          res.status(404).json({ message: 'No action exists with this id' });
        }
      } catch (error) {
        res.status(500).json({ error: 'The action could not be updated.' });
      }
    } else {
      res
        .status(404)
        .json({
          message:
            'Please include an update to one of description, notes, or completed',
        });
    }
  });

module.exports = routes;
