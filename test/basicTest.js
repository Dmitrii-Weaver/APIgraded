const chai = require ("chai")
const expect = require("chai").expect
chai.use(require('chai-http'))


const server = require ("../server")


describe('test#1 : create user, login and basic functions',  function(){

    before(function(){
        server.start()

    })
    after(function(){
        server.stop()
    })


    describe('test route /', function(){
        it("should return an ok code", async function(){
            await chai.request('http://localhost:3000').get('/')
            .then(response =>{
                expect(statusCode).to.equal(200)
            })
            .catch(error =>{

            })
        })
    })



    describe('test route  /register', function(){
        it("should register a user and return an 201 code", async function(){
            await chai.request('http://localhost:3000')
            .post('/register')
            .send({
                
                    "username":"b",
                    "email":"c",
                    "password":"b"
                
            })
            .then(response =>{
                expect(statusCode).to.equal(201)
            })
            .catch(error =>{

            })
        })
    
    
    })

    /*
    describe('test route  /loginForJWT', function(){
        it("should log in to the system", async function(){
            await chai.request('http://localhost:3000')
            .post('/loginForJWT')
            .send({
                
                    "username":"b",
                    "password":"b"
                
            })
            .then(response =>{
                
                console.log(response.body.token)
                expect(statusCode).to.equal(200)
                
            })
            .catch(error =>{

            })

               })
        })

        */

       describe('test route  /items', function(){
        it("should create an item", async function(){
            await chai.request('http://localhost:3000')
            .post('/items/createItem')
            .send({
                "item_id": 3,
                "item_info": {
                    "name": "ak-74M",
                    "description": "an alright, not stolen AK-74M",
                    "category": "tools",
                    "location": "Oulu",
                    "images": {},
                    "price": "100e",
                    "date_of_posting": "today",
                    "delivery": "pick up "
                },
                "item_seller": {
                    "name": "boris",
                    "phone": "12313",
                    "id": "1"
                }
            })
            .then(response =>{
                expect(statusCode).to.equal(200)
            })
            .catch(error =>{

            })
        })
    
    
        it("shows all items", async function(){
            await chai.request('http://localhost:3000')
            .get('/items')
            .then(res =>{
                console.log(res.body)
                expect(statusCode).to.equal(200)
            })
            .catch(error =>{
            })
        }) 
        it("shows items with an id '1' ", async function(){
            await chai.request('http://localhost:3000')
            .get('/items/1')   
            .then(res =>{
                console.log(res.body)
                expect(statusCode).to.equal(200)
            })
            .catch(error =>{
            })
        })
        it("shows items in category 'art' ", async function(){
            await chai.request('http://localhost:3000')
            .get('/items/category/art')   
            .then(res =>{
                console.log(res.body)
                expect(statusCode).to.equal(200)
            })
            .catch(error =>{
            })
        })
        it("shows items in location 'Oulu' ", async function(){
            await chai.request('http://localhost:3000')
            .get('/items/location/oulu')   
            .then(res =>{
                console.log(res.body)
                expect(statusCode).to.equal(200)
            })
            .catch(error =>{
            })
        })
        it("deletes an item with id '1'  ", async function(){
            await chai.request('http://localhost:3000')
            .delete('/items/1')   
            .then(res =>{
                expect(statusCode).to.equal(200)
            })
            .catch(error =>{
            })
        })
        it("shows all items, now without the deleted item", async function(){
            await chai.request('http://localhost:3000')
            .get('/items')
            .then(res =>{
                console.log(res.body)
                expect(statusCode).to.equal(200)
            })
            .catch(error =>{
            })
        }) 

        
    })
    


})

