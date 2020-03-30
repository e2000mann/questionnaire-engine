'use strict';

// up887818
// time to set up the database

const {
  Client
} = require('pg');

const db = require('./database/dbSetup.json');
const mockData = require('./database/mockData.json');

// Default values as no database yet created
const client = new Client({
  database: `postgres`,
  user: `postgres`,
  password: ``
});

// Creating Database
for (const query of db) {
  try {
    await client.query(query)
  } catch (e) {
    console.error(e.stack);
  }
}

// Adding mock data
for (const query of mockData) {
  try {
    await client.query(query)
  } catch (e) {
    console.error(e.stack);
  }
}

client.end();