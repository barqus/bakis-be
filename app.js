var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var participantsRouter = require('./routes/participants');
var settingsRouter = require('./routes/settings');
var errorHandlerMiddleware = require("./services/error-handler.js");
var sync = require('./services/sync')



var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/participants', participantsRouter);
app.use('/settings', settingsRouter);
app.use(errorHandlerMiddleware);

sync.syncParticipantsLeagueStandingsInformation();
sync.syncMatchHistory()
module.exports = app;