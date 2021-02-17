//setting up the API
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const users = require('./users');
const app = express()

//importing stuff
const passportInstance = require('./components/passport')
const itemsComponent = require('./components/items')


app.use(bodyParser.json());
app.set('port', (process.env.PORT || 80));


/*

LOG IN AND REGISTER SYSTEM 

*/
app.use(bodyParser.json());

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
      const jwtSecretKey = {secret : process.env.SECRET};

let options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = jwtSecretKey.secret;

app.get('/testProtected', passportInstance.authenticate('jwt', { session: false }),(req, res) => {
    console.log("jwt");
    res.json(
      {
        status: "Successfully accessed protected resource with JWT",
        user: req.user
      }
    );
  }
);



app.get('/loginForJWT',passportInstance.authenticate('basic', { session: false }),(req, res) => {
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
        serverInstance = app.listen(app.get('port'), () => {
            console.log(`API is running on port ${app.get('port')}`)
        })
    },
    stop: function(){
        serverInstance.close();
    }
}