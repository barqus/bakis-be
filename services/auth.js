const db = require('./db');
const helper = require('../helper');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const config = require('../config');
const jwt = require('jsonwebtoken');
const mailer = require('./mail')

async function register(user) {
  const hashedPassword = bcrypt.hashSync(user.password, saltRounds);

  const result = await db.query(
    'INSERT INTO users (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING id',
    [user.username, user.email, hashedPassword]
  );
  let message = 'Error in registering';

  const confirmationCode = jwt.sign({user_id: result[0].id, user_email: user.email}, config.token_secret);

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
        <a href=${config.host}/auth/confirm/${confirmationCode}> Click here</a>
        </div>`,
      };

    mailer.transporter.sendMail(mailData, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
   });
  }
  
  return { message, result };
}

async function login(user) {
  const rows = await db.query(
    'SELECT * FROM users WHERE email = $1 AND activated = true', [user.email],
  );
  const data = helper.emptyOrRows(rows);
  const passwordsMatch = bcrypt.compareSync(user.password, data[0].hashed_password); // false
  
  if (passwordsMatch) {
    const token = generateAccessToken({ user_id: data[0].id,  role: data[0].role });
    return { token };
  } else {
    throw(Error('Error: wrong password!'));
  }
}

async function activate(activation_code,req) {
  console.log("activation_code",activation_code)
  
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

function generateAccessToken(userContext) {
  return jwt.sign(userContext, config.token_secret, { expiresIn: '1800s' });
}

module.exports = {
  register,
  login,
  activate,
}