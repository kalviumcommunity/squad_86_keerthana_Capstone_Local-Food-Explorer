const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Food = require('./models/Food');
const Region = require('./models/Region');

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

// Regions
app.post('/regions', async (req, res) => {
    try {
        const { name, description } = req.body;
        const region = new Region({ name, description });
        await region.save();
        res.status(201).json(region);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/regions', async (req, res) => {
    try {
        const regions = await Region.find();
        res.json(regions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all foods
app.get('/foods', async (req, res) => {
    try {
        const foods = await Food.find().populate('region');
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET foods by region
// Legacy: by region name; resolve Region and return foods
app.get('/foods/region/:region', async (req, res) => {
  try {
    const regionDoc = await Region.findOne({ name: req.params.region });
    if (!regionDoc) {
      return res.status(404).json({ message: 'Region not found' });
    }
    const foods = await Food.find({ region: regionDoc._id }).populate('region');
    if (foods.length === 0) {
      return res.status(404).json({ message: 'No foods found for this region' });
    }
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// New: by regionId
app.get('/foods/by-region/:regionId', async (req, res) => {
  try {
    const foods = await Food.find({ region: req.params.regionId }).populate('region');
    if (foods.length === 0) {
      return res.status(404).json({ message: 'No foods found for this region' });
    }
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//POST api endpoint
app.post('/foods', async(req,res) => {
  const {name, region, description, image} = req.body;

  try{
    const newFood = new Food({name, region, description, image});
    await newFood.save();
    const populated = await newFood.populate('region');
    res.status(201).json(populated);
  }

  catch(err){
    res.status(500).json({message: err.message});
  }
});

//PUT api endpoint
app.put('/foods/:id', async(req,res) => {
  const {name, region, description, image} = req.body;

  try{
    const updateFood = await Food.findByIdAndUpdate(
      req.params.id,
      {name, region, description, image},
      {new: true}
    ).populate('region');

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
