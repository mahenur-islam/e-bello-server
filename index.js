const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mogodb code

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluster0.y0wkhwt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //database name and collection name
    const productsCollection = client.db("productDB").collection("products");

    //creating collection for brand name
    const brandCollection = client.db("productDB").collection("brands");

    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/brands", async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
    });

    //read data from the server
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //read data from the server
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    //update product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;

      const product = {
        $set: {
          productName: updatedProduct.productName,
          brandName: updatedProduct.brandName,
          description: updatedProduct.description,
          types: updatedProduct.types,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          photoUrl: updatedProduct.photoUrl,
        },
      };

      try {
        const result = await productsCollection.updateOne(
          filter,
          product,
          options
        );
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: "Error updating product" });
      }
    });

    //receive newProduct data from server side - post method
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);

      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    //delete a product from server side - delete method

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };

      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("e-bello is running from the server");
});

app.listen(port, () => {
  console.log(`e-cello server is running on port: ', ${port}`);
});
