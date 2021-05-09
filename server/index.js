

const keys = require('./keys');

// Express app setup

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());



// Postgress Client Setup

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

console.log("connecting to db!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
pgClient.on('error', () => console.log('Lost pg connection!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11'));
pgClient.on('connect', () => {
  console.log("Connecting and creating table!");
  pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log(err));
});

pgClient.connect();

// Redis client setup

const redis  = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});


const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, resp) => {
  resp.send('Hi');
});

app.get('/values/all', async (req, resp) => {
  const values = await pgClient.query('SELECT * from values')
  resp.send(values.rows);
});


 app.get('/values/current', async (req, resp) => {
   redisClient.hgetall('values', (err, values)  => {
     resp.send(values)
   });
 });

 //

 app.post('/values', async  (req, res) => {
   const index = req.body.index;

   if (parseInt(index) > 40) {
     return res.status(422).send('Index too high');
   }
   redisClient.hset('values', index, 'Nothing yet!');
   redisPublisher.publish('insert', index);
   pgClient.query('INSERT INTO values(numbers) VALUES ($1)', [index]);
   res.send({ working: true})
 });

 app.listen(5000, err => {
   console.log('Listening');
 });

