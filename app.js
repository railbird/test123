'use strict';
const express = require('express');
const database = require(__dirname + '/database');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
  console.log("Server running on port 3001");
});

/*app.use( ( req, res, next) => {
  next();
});*/

app.get('/companies', ( req, res) => {
  if(!req.query.name) {
     database.getAll(res) // sends back all companies in db with just the  name
   } else
   {
    database.search(res, req.query.name);
  };
});
app.get('/companies/details', (req, res) => {
  console.log("yeeeeeeees im here");
  database.getAll(res, true); // sends back all companies in db with all data
});
