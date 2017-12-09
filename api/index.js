'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// get the database model, use `export DBTYPE=inmemory` to use the in-memory model
const modelType = process.env.DBTYPE || 'datastore';
const db = require(`./db-datastore`); // Require the datastore API

const api = express.Router();

api.get('/', async (req, res) => {
  try {
    res.json(await db.list());
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// Get the value of an ID
api.get('/:id(\\w+)', async (req, res) => {
  try {
    res.send(await db.get(req.params.id));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// Send the data (KeyID and its value) that will overwrite the existing value
api.put('/:id(\\w+)', bodyParser.text(), async (req, res) => {
  try {
    res.send(await db.put(req.params.id, req.body));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// Send the data entry (KeyID and its value) that will be added to the datastore
api.post('/:id(\\w+)', bodyParser.text(), async (req, res) => {
  try {
    res.send(await db.post(req.params.id, req.body));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// Delete the datastore entry with the same parsed ID
api.delete('/:id(\\w+)', async (req, res) => {
  try {
    res.send(await db.delete(req.params.id), 204);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = api;
