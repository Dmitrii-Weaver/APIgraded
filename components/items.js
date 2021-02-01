const express = require('express')

const bodyParser = require('body-parser')
const app = express()
const Ajv = require('ajv').default

const itemSchema = require("../schemas/items_schema.json")

const router = express.Router();



let items_data = {
    items : [
    {
        item_id: 1,
        item_info: {
            name: "Priceless piece of art",
            description: "This piece of art is priceless. Not for sale, just showing off.",
            category: "art",
            location: "Oulu",
            images: {},
            price: "priceless",
            date_of_posting: "tomorrow",
            delivery: "pick up"
        },
        item_seller: {
            name: "Dmitrii",
            phone: "1",
            id: "1106"
        }
    },
  ]}


app.use(bodyParser.json());

router.get('/', (req,res) => {
    res.send(items_data.items)
})

router.get(`/:id`, (req,res) => {
    const result = items_data.items.find(i => {
        if(i.item_id == req.params.id){
            return true
        }
        else{
            return false
        }
    })
    if(result === undefined)
    {
        res.sendStatus(404)
    }
    else
    {
        res.json(result);
    }
})


router.delete('/:id', (req,res) => {
    items_data.items = items_data.items.filter(item => item.item_id != req.params.id)
    res.sendStatus(200)
})



router.post("/createItem", (req,res) =>{
    const ajv = new Ajv()
    const validate = ajv.compile(itemSchema)
    const valid = validate(req.body)
    if(valid == true ){
        items_data.items.push(req.body)
        res.send("ok")
    }
    else{
        res.sendStatus(400)
    }
})






module.exports = router;