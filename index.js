const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.port || 5000;


//middleware


app.use(cors());

app.use(express.json());


app.get('/', (req, res) => {
    res.send('HELLO MON!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster007.r832gbh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);


async function run() {
    try {
        const serviceCollection = client.db('cateringServices').collection('services');
        const purchaseCollection = client.db('cateringServices').collection('purchase');

        app.get('/serviceshome', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const services = await serviceCollection.findOne(query);
            res.send(services);
        });

        app.get('/purchase', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = purchaseCollection.find(query);
            const purchase = await cursor.toArray();
            res.send(purchase);
        });

        app.post('/purchase', async (req, res) => {
            const purchase = req.body;
            console.log(purchase);
            const result = await purchaseCollection.insertOne(purchase);
            res.send(result);
        });


    }

    finally {

    }
}

run().catch(err => console.log(err));





app.listen(port, () => {
    console.log(`Server is running in port number ${port}`);
})
