const express = require('express');
const { MongoClient, FindCursor } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w5wg2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('hotOnion');
        const foodCollection = database.collection('foods');

        // GET API
        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        })

        // POST API
        app.post('/foods', async (req, res) => {
            const food = req.body;
            console.log('hit the post api', food);

            const result = await foodCollection.insertOne(food);
            console.log(result);
            res.json(result)
        });

        // DELETE API
        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await foodCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Hot Onion Server');
});

app.listen(port, () => {
    console.log('Running Genuis server in port', port);
})