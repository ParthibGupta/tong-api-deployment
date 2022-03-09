process.env.NODE_ENV = 'test';

//Dependency declarations
const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../config/app');
const should = chai.should();
const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');

chai.use(chaiHttp);

describe('Authentication processes', () => {
    before((done) => { 
        //Before this describe, we remove all previous db entries
        User.deleteMany({}, (err) => { 
            Store.deleteMany({}, (err) => { 
                Product.deleteMany({}, (err) => {
                    done(); 
                });     
            }); 
        });    
    });

    describe('Registration processes', () => {
        const url = '/auth/register';

        it('Should register user with correct credentials', (done) => {
            let user = {
                email: 'apitest@gmail.com',
                password: 'password',
                firstName: 'test',
                lastName: 'user',
            }
            chai.request(app)
                .post(url)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Successfully registered');
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('email').eql('apitest@gmail.com');
                    res.body.user.should.have.property('firstName').eql('test');
                    res.body.user.should.have.property('lastName').eql('user');
                    res.body.user.should.have.property('password');
                    res.body.user.should.have.property('storeId').eql(null);
                    res.body.should.have.property('token');
                done();
            });
        });

        it('Should give error when registering user with incomplete credentials', (done) => {
            let user = {
                email: 'apitest2@gmail.com'
            }
            chai.request(app)
                .post(url)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Missing credentials');
                    done();
            });
        });

        it('Should give error when registering an existing user', (done) => {
            let user = {
                email: 'apitest@gmail.com',
                password: 'aweawewaea',
                firstName: 'test2',
                lastName: 'user2',
            }
            chai.request(app)
                .post(url)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User already registered');
                done();
            });
        });

        const url2 = '/auth/register-and-create-store';
        it('Should register user and create store with correct credentials', (done) => {
            let userData = {
                email: 'apitest2@gmail.com',
                password: 'password',
                firstName: 'test',
                lastName: 'user',
            }

            let storeData = {
                name: 'Test Name',
                contactEmail: 'apitest2@gmail.com',
                description: 'Test description',
                deliveryCharge: 20,
                promoCodes: [],
                discounts: [],
                socials: ["", "", "", ""],
                contacts: [],
                displayPhoto: 'Test display photo URL',
                coverPhoto: 'Test cover photo URL',
                returnPolicy: 'Test return policy',
                address: "Test address",
                product: {
                    productName: 'Test product name',
                    productPrice: 20,
                    productDescription: 'Test product description',
                    productPicture: 'Test product picture'
                }
            }

            chai.request(app)
                .post(url2)
                .send({ userData, storeData })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Successfully registered');
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('email').eql('apitest2@gmail.com');
                    res.body.user.should.have.property('firstName').eql('test');
                    res.body.user.should.have.property('lastName').eql('user');
                    res.body.user.should.have.property('password');
                    res.body.user.should.have.property('storeId');

                    Store.findById(res.body.user.storeId, (err, store) => {
                        res.body.user.should.have.property('storeId').eql(store._id.toString());
                        res.body.should.have.property('token');
                        done();
                    });
            });
        });
    });

    describe('Login processes', () => {
        const url = '/auth/login'
        it('Should login user successfully', (done) => {
            let user = {
                email: 'apitest@gmail.com',
                password: 'password'
            }
            chai.request(app)
                .post(url)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Logged in successfully');
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('email').eql('apitest@gmail.com');
                    res.body.user.should.have.property('firstName').eql('test');
                    res.body.user.should.have.property('lastName').eql('user');
                    res.body.user.should.have.property('password');
                    res.body.user.should.have.property('storeId').eql(null);
                    res.body.should.have.property('token');
                done();
            });
        });

        it('Should throw error when credentials missing', (done) => {
            let user = {
                email: 'apitest@gmail.com'
            }
            chai.request(app)
                .post(url)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Missing credentials');
                done();
            });
        });

        it('Should throw error when email is incorrect', (done) => {
            let user = {
                email: 'apitest3@gmail.com',
                password: 'password'
            }
            chai.request(app)
                .post(url)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Email or password is incorrect');
                done();
            });
        });

        it('Should throw error when email is correct, but password is incorrect', (done) => {
            let user = {
                email: 'apitest@gmail.com',
                password: 'password2'
            }
            chai.request(app)
                .post(url)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Password is incorrect');
                done();
            });
        });
    });
    
});

