

const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const app = express()
const Ajv = require('ajv').default
const itemSchema = require("../schemas/items_schema.json")

var cloudinary = require('cloudinary').v2
var {CloudinaryStorage} = require('multer-storage-cloudinary')

const router = express.Router();

const passportInstance = require('./passport')


var storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params : {
    folder : 'images',
    allowedFormats: ['jpg', 'png'],
    public_id: ("1")}
})

var parser = multer({ storage: storage })


let items_data = {
    items: [
        {
            item_id: 1,
            item_info: {
                name: "Priceless piece of art",
                description: "This piece of art is priceless. Not for sale, just showing off.",
                category: "art",
                location: "oulu",
                images: [],
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
        {
            item_id: 2,
            item_info: {
                name: "Worthless piece of art",
                description: "This piece of art is worthless. Just take it.",
                category: "art",
                location: "oulu",
                images: [],
                price: "0e",
                date_of_posting: "yesterday",
                delivery: "pick up"
            },
            item_seller: {
                name: "Dmitrii",
                phone: "1",
                id: "1106"
            }
        },

    ]
}


app.use(bodyParser.json());

router.get('/', (req, res) => {
    res.send(items_data.items)
})

router.get(`/:id`, (req, res) => {
    const result = items_data.items.find(i => {
        if (i.item_id == req.params.id) {
            return true
        }
        else {
            return false
        }
    })
    if (result === undefined) {
        res.sendStatus(404)
    }
    else {
        res.json(result);
    }
})

router.get(`/category/:category`, (req, res) => {
    const result = items_data.items.filter(i => i.item_info.category == req.params.category)
    if (result === undefined) {
        res.sendStatus(404)
    }
    else {
        res.json(result);
    }
})

router.get(`/location/:location`, (req, res) => {
    const result = items_data.items.filter(i => i.item_info.location == req.params.location)
    if (result === undefined) {
        res.sendStatus(404)
    }
    else {
        res.json(result);
    }
})


router.get(`/user/:id`, (req, res) => {
    const result = items_data.items.filter(i => i.item_seller.id == req.params.id)
    if (result === undefined) {
        res.sendStatus(404)
    }
    else {
        res.json(result);
    }
})




router.delete('/:id', passportInstance.authenticate('jwt', { session: false }), (req, res) => {
    let neededItem = items_data.items.find(i => i.item_id == req.params.id)
    if (neededItem.item_seller.id == req.user.id) {
        items_data.items = items_data.items.filter(item => item.item_id != req.params.id)
        res.sendStatus(200)
    }
    else if (neededItem == undefined) {
        res.sendStatus(404)
    }
    else if (neededItem.item_seller.id != req.user.id) {
        res.sendStatus(401)
    }

})

router.put('/:id', passportInstance.authenticate('jwt', { session: false }), (req, res) => {
    const ajv = new Ajv()
    const validate = ajv.compile(itemSchema)
    const valid = validate(req.body)
    if (valid == true) {
        let neededItem = items_data.items.find(i => i.item_id == req.params.id)
        if (neededItem.item_seller.id == req.user.id) {
            let index = items_data.items.indexOf(neededItem)
            items_data.items[index] = req.body
            res.sendStatus(200)
        }
        else if (neededItem == undefined) {
            res.sendStatus(404)
        }
        else if (neededItem.item_seller.id != req.user.id) {
            res.sendStatus(401)
        }
    }
    else {
        res.sendStatus(400)
    }
})



router.post("/", passportInstance.authenticate('jwt', { session: false }), (req, res) => {
    const ajv = new Ajv()
    const validate = ajv.compile(itemSchema)
    const valid = validate(req.body)
    if (valid == true) {
        items_data.items.push(req.body)
        res.sendStatus(200)
    }
    else {
        res.sendStatus(400)
    }
})


router.post('/uploadImage/:id', parser.single('image'), passportInstance.authenticate('jwt', { session: false }), function (req, res) {


    let neededItem = items_data.items.find(i => i.item_id == req.params.id)
    if (neededItem.item_seller.id == req.user.id) {
        let index = items_data.items.indexOf(neededItem)
        items_data.items[index].item_info.images.push(req.file)
        console.log(req.file);
        res.json(req.file);
        res.sendStatus(200)



    }
    else if (neededItem == undefined) {
        console.log(req.file);
        res.json(req.file);
        res.sendStatus(404)
    }
    else if (neededItem.item_seller.id != req.user.id) {
        console.log(req.file);
        res.json(req.file);
        res.sendStatus(401)
    }



    /*
    fs.rename(req.file.path, './uploads/' + req.file.originalname, function (err) {
        if (err) throw err;
        console.log('renamed complete');
        res.send("Test");
      });    */

});




module.exports = router;