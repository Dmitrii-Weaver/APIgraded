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

    let KEY 
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
    
    
 


})