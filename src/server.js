import express from 'express';
import path, { dirname } from 'path';
import fs from 'fs';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

let app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/profile-picture', function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
  res.writeHead(200, { 'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

// use when starting application locally
let mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// use when starting application as docker container
let mongoUrlDocker = "mongodb://admin:password@mongodb";

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// "user-account" in demo with docker. "my-db" in demo with docker-compose
let databaseName = "my-db";

app.post('/update-profile', function (req, res) {
  let userObj = req.body;

  MongoClient.connect(mongoUrlLocal, mongoClientOptions).then(client => {
    let db = client.db(databaseName);
    userObj['userid'] = 1;
    console.log('ready')

    let myquery = { userid: 1 };
    let newvalues = { $set: userObj };

    db.collection("users").updateOne(myquery, newvalues, { upsert: true }).then(res => {
      client.close();
    });

  }).catch(err => {
    console.log("connection failure.... ", url);
    console.log("connection errored ", err);
  });
  // Send response
  res.send(userObj);
});

app.get('/get-profile', function (req, res) {
  let response = {};
  console.log('get');

  MongoClient.connect(mongoUrlLocal, mongoClientOptions).then((client) => {
    console.log("mongo db conection success");

    let db = client.db(databaseName);

    let myquery = { userid: 1 };

    db.collection("users").findOne(myquery).then((result) => {
      response = result;
      client.close();

      // Send response
      res.send(response ? response : {});
    });

  }).catch(err => {
    console.log("connection failure.... ", url);
    console.log("connection errored ", err);
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
