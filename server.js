const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Food = require('./models/Food');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

//Mongodb connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected successfully")
})
.catch((err) => {
    console.error("Connection failed", err);
})

app.get('/', (req,res) => {
    res.send("Server is running successfully");
});

//Routes

//GET all foods
app.get('/foods', async(req,res) => {
    try{
        const foods = await Food.find();
        if(!foods){
            res.status(404).json({message: error.message});
        };

        res.json(foods);
    }

    catch(err){
        res.status(500).json({message: err.message});
    }
});

//GET foods by city
app.get('/foods/:city', async(req,res) => {
    try{
        const foods = await Food.findById(req.params.id);
        if(!foods){
            res.json(404).json({message: error.message});
        };

        res.json(foods);
    }

    catch(err){
        res.status(500).json({message: err.message});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
