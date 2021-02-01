const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const Ajv = require('ajv').default

const itemSchema = require("../schemas/items_schema.json")

const router = express.Router();


app.use(bodyParser.json());

router.get('/', (req,res) => {
    res.send("items component")
})


router.post("/createItem", (req,res) =>{
    const ajv = new Ajv()
    const validate = ajv.compile(itemSchema)
    const valid = validate(req.body)
    if(valid == true ){
        res.send("ok")
    }
    else{
        res.sendStatus(400)
    }
})


module.exports = router;