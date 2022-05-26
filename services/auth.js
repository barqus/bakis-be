const db = require('./db');
const helper = require('../helper');
// const bcrypt = require('bcrypt');
const { scryptSync, randomBytes } = require("crypto");
var bcrypt = require('bcryptjs');
const saltRounds = 10;
const config = require('../config');
const jwt = require('jsonwebtoken');
const mailer = require('./mail')
// const { ApiClient } = require('twitch');
// const { ClientCredentialsAuthProvider } = require('twitch-auth');
// const authProvider = new ClientCredentialsAuthProvider(config.twitch_client_id, config.twitch_secret);
// const apiClient = new ApiClient({ authProvider });
const superagent = require('superagent');

async function register(user) {
  const hashedPassword = bcrypt.hashSync(user.password, saltRounds);

  const result = await db.query(
    'INSERT INTO users (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING id',
    [user.username, user.email, hashedPassword]
  );
  let message = 'Error in registering';

  const confirmationCode = jwt.sign({ user_id: result[0].id, user_email: user.email }, config.token_secret);

  if (result.length) {
    message = 'Registered successfully';
    const mailData = {
      from: 'fillq.auto@gmail.com',  // sender address
      to: user.email,   // list of receivers
      subject: 'FillQ Email Confirmation',
      // text: 'That was easy!',
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${user.username}</h2>
        <p>Thank you for creating account at FillQ!. Please confirm your email by clicking on the following link:</p>
        <a href=${config.fe_host}/account/activate?code=${confirmationCode}> Click here</a>
        </div>`,
    };

    mailer.transporter.sendMail(mailData, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });
  }

  return { message, result };
}

async function resetPassword(user) {
  const rows = await db.query(
    'SELECT * FROM users WHERE email = $1', [user.email],
  );
  const data = helper.emptyOrRows(rows);

  const confirmationCode = jwt.sign({ user_id: data[0].id, user_email: user.email }, config.token_secret);

  if (data.length) {
    message = 'Reset requested';
    const mailData = {
      from: 'fillq.auto@gmail.com',  // sender address
      to: user.email,   // list of receivers
      subject: 'FillQ Password Reset',
      // text: 'That was easy!',
      html: `<h1>Password Reset</h1>
        <h2>Hello ${user.email}</h2>
        <p>Please reset password by clicking on the following link:</p>
        <a href=${config.fe_host}/password/reset?code=${confirmationCode}> Click here</a>
        </div>`,
    };

    mailer.transporter.sendMail(mailData, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });
  }
}


async function login(user) {
  const rows = await db.query(
    'SELECT * FROM users WHERE email = $1 AND activated = true', [user.email],
  );
  const data = helper.emptyOrRows(rows);
  const passwordsMatch = bcrypt.compareSync(user.password, data[0].hashed_password); // false

  if (passwordsMatch) {
    const token = generateAccessToken({ user_id: data[0].id, role: data[0].role });
    return { token };
  } else {
    throw (Error('Error: wrong password!'));
  }
}

async function authTwitch(code) {
  let twitchLoginURL = `https://id.twitch.tv/oauth2/token?client_id=${config.twitch_client_id}&client_secret=${config.twitch_secret}&code=${code}&grant_type=${config.grant_type}&redirect_uri=${config.twitch_redirect}`
  console.log("twitchLoginURL", twitchLoginURL)
  const authObject = await superagent.post(twitchLoginURL);

  let userTwitchURI = "https://api.twitch.tv/helix/users"
  let out = await superagent.get(userTwitchURI).set("Client-Id", config.twitch_client_id).set("Authorization", "Bearer " + authObject.body.access_token)
  let user = {username: out.body.data[0].display_name, email: out.body.data[0].email}
  let emailExists = await checkIfEmailExists(user)

  let userID = ""
  let userRole =""
  if(!emailExists) {
    const hashedPassword = bcrypt.hashSync(authObject.body.access_token, saltRounds);

    const result = await db.query(
      'INSERT INTO users (username, email, hashed_password, activated) VALUES ($1, $2, $3, $4) RETURNING id, role',
      [user.username, user.email, hashedPassword, true]
    );

    userID = result[0].id
    userRole = result[0].role

  } else {
    const rows = await db.query(
      'SELECT id, role  FROM users WHERE email = $1', [out.body.data[0].email],
    );
    var data = helper.emptyOrRows(rows);

    userID = data[0].id
    userRole = data[0].role
  }

  const token = generateAccessToken({ user_id: userID, role: userRole });

  console.log(token)
  return { token };
}


async function checkIfUsernameExists(user) {
  const rows = await db.query(
    'select exists(select 1 from users where username=$1)', [user.username],
  );
  const data = helper.emptyOrRows(rows);

  return data[0].exists
}

async function checkIfEmailExists(user) {
  const rows = await db.query(
    'select exists(select 1 from users where email=$1)', [user.email],
  );
  const data = helper.emptyOrRows(rows);

  return data[0].exists
}

async function activate(activation_code, req) {
  console.log("activation_code", activation_code)

  jwt.verify(activation_code, config.token_secret, async (err, user) => {
    if (err) {
      return
    }

    req.user = user

    const { user_id } = user;
    console.log("HERE")
    await db.query(
      'UPDATE users SET activated=true WHERE id=$1',
      [user_id],
    );
  });
}

async function newPassword(user) {
  const hashedPassword = bcrypt.hashSync(user.password, saltRounds);

  const result = await db.query(
    ' UPDATE users SET hashed_password=$1 WHERE id=$2 RETURNING id',
    [hashedPassword, user.id]
  );
  let message = 'Error in registering';

  return { message, result };
}

function generateAccessToken(userContext) {
  return jwt.sign(userContext, config.token_secret, { expiresIn: '1800s' });
}




module.exports = {
  register,
  login,
  activate,
  checkIfUsernameExists,
  checkIfEmailExists,
  authTwitch,
  resetPassword,
  newPassword,
}