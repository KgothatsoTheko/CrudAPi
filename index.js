const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')

//middleware
app.use(express.json())
app.use(cors())


//connect to mongo
mongoose.connect(process.env.MONGO_URI)
    .then(console.log("connected to mongoDB"))
     .catch(err => console.log("error", err))

     // Define a simple schema and model
const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    amount: {type: Number}
});

const Item = mongoose.model('Item', ItemSchema);

// CRUD Routes
// Create an item
app.post('/add-items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(200).send(savedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read all items
app.get('/get-items', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).send(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read single item
app.get('/find-items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).send("Item not found");
        res.status(200).send(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an item
app.put('/update-items/:name', async (req, res) => {
    try {
        const options = { upsert: true };
        const filter = { ...req.params }
        const updatedItem = await Item.updateOne(filter, req.body, options)
        if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an item
app.delete('/delete-items/:name', async (req, res) => {
    try {
        const query = { ...req.params }
        const deletedItem = await Item.deleteOne(query);
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//start local server
const PORT1 = process.env.PORT1 || 3313;
app.listen(PORT1, '0.0.0.0', () => console.log(`Server running on port ${PORT1}`))


