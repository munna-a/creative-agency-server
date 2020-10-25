const express = require('express')
const app = express()
const port = 3001

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors')
app.use(cors())

require('dotenv').config()

const ObjectId = require('mongodb').ObjectId;


const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lb4b8.mongodb.net/creative-agency?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const service = client.db("creative-agency").collection("servicesCl");
    const admin_collection = client.db("creative-agency").collection("admin_email");
    const orders = client.db("creative-agency").collection("ordersCl");
    const reviews = client.db("creative-agency").collection("reviewsCl");
    console.log("db connected")


    app.post('/checkingUser' , (req, res)=>{
        admin_collection.find({email: req.body.email})
            .toArray((err, documents) => {
                if(documents.length > 0){
                    res.send({person: 'admin'})
                }else{
                    res.send({person: 'user'})
                }
            })
    })

    app.get('/findAdminEmails', (req, res) => {
        admin_collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


    app.post('/addNewAdmin', (req, res) => {
        admin_collection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addService', (req, res) => {
        service.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addReview', (req, res) => {
        reviews.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

   
    app.post('/orderItem' , (req, res) => {
        orders.find({email: req.body.email})
            .toArray((err, documents) =>{
                res.send(documents);
            })
    })

    app.get('/serviceItem', (req, res) => {
        service.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.delete('/deleteItem/:id', (req, res) => {
        service.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                if (documents.length > 0) {
                    service.deleteOne({ _id: ObjectId(req.params.id) })
                        .then(result => {
                            res.send(result.deletedCount > 0)
                        })
                }
            })
    })

    app.get('/totalOrders', (req, res) => {
        orders.find({})
            .toArray((err, documents)=>{
                res.send(documents)
            })
    })

    app.post('/placeOrder', (req, res) => {
        orders.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/usersReview', (req, res) => {
        reviews.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
});



app.get('/', (req, res) => {
    res.send('Welcome creative agency server')
})

app.listen(process.env.PORT || port)