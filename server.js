//setting up the API
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const users = require('./users');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const app = express()

//importing stuff

const itemsComponent = require('./components/items')


const port = 3000
app.use(bodyParser.json());



/*

LOG IN AND REGISTER SYSTEM 

*/
app.use(bodyParser.json());
passport.use(new BasicStrategy(
    function (username, password, done) {
        const user = users.getUserByName(username)
        if (user == undefined) {
            console.log("user not found")
            return done(null, false, { message: "user not found" });
        }
        if (bcrypt.compareSync(password, user.password) == false) {
            console.log("wrong password")
            return done(null, false, { message: "wrong password" });
        }
        return done(null, user)

    }
))

app.post('/register', (req, res) => {
    if ('username' in req.body == false) {
        res.status(400)
        res.json({ status: "username not received" })
        return
    }
    if ('password' in req.body == false) {
        res.status(400)
        res.json({ status: "password not received" })
        return
    }
    if ('email' in req.body == false) {
        res.status(400)
        res.json({ status: "email not received" })
        return
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 6)
    users.addUser(req.body.username, req.body.email, hashedPassword);
    res.status(201).json({ status: "user created" });
})


const jwt = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecretKey = require('./jwt-key.json');

let options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = jwtSecretKey.secret;

passport.use(new JwtStrategy(options, function(jwt_payload, done) {

  const now = Date.now() / 1000;
  if(jwt_payload.exp > now) {
    done(null, jwt_payload.user);
  }
  else {
    done(null, false);
  }
}));


app.get('/testProtected',passport.authenticate('jwt', { session: false }),(req, res) => {
    console.log("jwt");
    res.json(
      {
        status: "Successfully accessed protected resource with JWT",
        user: req.user
      }
    );
  }
);



app.get('/loginForJWT',passport.authenticate('basic', { session: false }),(req, res) => {
    const body = {
      id: req.user.id,
      email : req.user.email
    };

    const payload = {
      user : body
    };

    const options = {
      expiresIn: '1d'
    }

    const token = jwt.sign(payload, jwtSecretKey.secret, options);
    res.status(200)

    return res.json({ token });
    
})

/* 

MAIN BLOCK

*/

app.use('/items', itemsComponent);

app.get('/', (req,res) =>{
    res.send('OAOA MMM)')
})





/*

SERVER EXPORT

*/
module.exports = {
    start: function(){
        serverInstance = app.listen(port, () => {
            console.log(`API is running on port ${port}`)
        })
    },
    stop: function(){
        serverInstance.close();
    }
}