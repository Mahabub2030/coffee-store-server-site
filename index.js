const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// my user with passwrod
// mahaubu2030
// jWyFA3Lj93p8fGZp

// middleware
app.use(cors());
app.use(express.json());


// mongodb code start here 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x9t7sgg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const coffeeCalection = client.db('coffeeDB').collection('coffee')

    app.get('/coffee', async(req, res)=>{
      const cursor = coffeeCalection.find();
      const result = await cursor.toArray();
      res.send(result);

    })


    app.get('/coffee/:id', async(req ,res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await coffeeCalection.findOne(query);
      res.send(result);

    })





    // our custom code start here
    app.post('/coffee', async(req, res)=>{
      const newCoffee = req.body;
      console.log(newCoffee)
      const result = await coffeeCalection.insertOne(newCoffee);
      res.send(result);

    })

    app.put('/coffee/:id',async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const opttions={upsert: true};

      const updatedCoffee = req.body

      const coffee = {
        $set:{
          name:updatedCoffee.name,
           quantity:updatedCoffee.quantity,
            Supplier:updatedCoffee.Supplier,
             Taste:updatedCoffee.Taste,
              Category:updatedCoffee.Category,
               Details:updatedCoffee.Details,
                Photo:updatedCoffee.Photo
        }
      }
      const result = await coffeeCalection.updateOne(filter,coffee,opttions )
      res.send(result)
    })






    app.delete('/coffee/:id', async(req, res)=>{
      const id =req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCalection.deleteOne(query);
      res.send(result)
    })



    // our custom code end here





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb code end here 


app.get('/', (req, res) => {
  res.send('New Sever ruing wiht mongobd')
})
app.listen(port, () => {
  console.log(`New server is running on port : ${port}`)
})