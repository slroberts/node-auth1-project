const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const restricted = require('../auth/restricted-middleware.js');

//get our express routers
const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');

//create the server
const server = express();

// create the config object for express-session.
const sessionConfig = {
  name: 'srsession',
  secret: 'lifeiswhatyoumakeit!',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, //should be true in production
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require('../data/connection.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};

// global middleware
server.use(helmet());
server.use(cors());
server.use(logger);
server.use(express.json());
server.use(session(sessionConfig));

server.use('/api/users', restricted, usersRouter);
server.use('/api/', authRouter);

server.get('/', (req, res) => {
  res.status(200).json({
    api: 'up',
  });
});

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'host'
    )}`
  );

  next();
}

module.exports = server;
