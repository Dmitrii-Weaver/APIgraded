const express = require('express')
const bodyParser = require('body-parser')
const Ajv = require('ajv').default
const app = express()
const port = 3000

app.use(bodyParser.json());




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