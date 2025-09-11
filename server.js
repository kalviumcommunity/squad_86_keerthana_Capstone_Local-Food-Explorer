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

// GET all foods
app.get('/foods', async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET foods by region
app.get('/foods/region/:region', async (req, res) => {
  try {
    const foods = await Food.find({ region: req.params.region });
    if (foods.length === 0) {
      return res.status(404).json({ message: "No foods found for this region" });
    }
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//POST api endpoint
app.post('/foods', async(req,res) => {
  const {name, region, description} = req.body;

  try{
    const newFood = new Food({name, region, description});
    await newFood.save();
    res.status(201).json(newFood);
  }

  catch(err){
    res.status(201).json({message: err.message});
  }
});

//PUT api endpoint
app.put('/foods/:id', async(req,res) => {
  const {name, region, description, image} = req.body;

  try{
    const updateFood = await Food.findByIdAndUpdate(req.params.id, {name, region, description, image}, {new: true});

    if(!updateFood){
      return res.status(404).json({message : 'Food item not found'});
    }

    res.json(updateFood);
  }

  catch(err){
    res.status(500).json({message: err.message});
  }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
