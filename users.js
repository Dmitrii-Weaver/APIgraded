const { use } = require("passport");


let users = [
  {
    id: 1,
    username: 'John1337',
    email: 'John@mail.com',
    password: '$2y$06$eQav1OaIyWSUnlvPSaFXRe5gWRqXd.s9vac1SV1GafxAr8hdmsgCy', // johndoepassword
    validApiKey: null
  },
];

module.exports = {
  getUserById: (id) => users.find(u => u.id == id),
  getUserByName: (username) => users.find(u => u.username == username),

  getUserWithApiKey: (apiKey) => users.find(u => u.validApiKey == apiKey),
  addUser: (username, email, password) => {
    users.push({
      id: Math.floor((Math.random() * 9999999) + 1),
      username,
      email,
      password
    });
  }

}