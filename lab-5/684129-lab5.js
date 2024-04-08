const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// In-memory data structure
let cars = [
  { id: 1, make: "Bugatti", model: "Chiron", year: 2024, colour: "Blue", engineType: "W16 Quad-Turbocharged" },
  { id: 2, make: "Ferrari", model: "SF90 Stradale", year: 2023, colour: "Red", engineType: "Plug-in Hybrid V8" },
  { id: 3, make: "Lamborghini", model: "Aventador Ultimae", year: 2022, colour: "Yellow", engineType: "V12" },
  { id: 4, make: "McLaren", model: "765LT", year: 2021, colour: "Orange", engineType: "Twin-Turbocharged V8" },
  { id: 5, make: "Koenigsegg", model: "Jesko", year: 2020, colour: "Black", engineType: "Twin-Turbocharged V8" }
]
 
// Error handling function
const handleError = (err, res) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
};

// Get all cars
app.get('/cars', (req, res) => {
  try {
    res.status(200).json(cars);
  } catch (err) {
    handleError(err, res);
  }
});

// Get a car by ID
app.get('/cars/:id', (req, res) => {
  try {
    const { id } = req.params;
    const car = cars[id-1];
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (err) {
    handleError(err, res);
  }
});

// Update a car
app.put('/cars/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (!cars[id-1]) {
        return res.status(404).json({ message: 'Car not found' });
      }
      cars[id-1] = { ...cars[id-1], ...updates };
      res.status(200).json({ message: 'Car updated successfully' });
    } catch (err) {
      handleError(err, res);
    }
});

// Create a car
app.post('/cars', (req, res) => {
  try {
    const newCar = req.body;
    const { make, model, year, colour, engineType } = newCar;
    if (!make || !model) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const idExists = cars.some(car => car.id === newCar.id);
    if (idExists) {
      return res.status(400).json({ message: 'ID already exists' });
    }

    const id = cars.length + 1;
    const createdCar = { id, ...newCar };
    cars.push(createdCar);
    res.status(201).json({ message: 'Car created successfully', car: createdCar });
  } catch (err) {
    handleError(err, res);
  }
});

// Delete a car
app.delete('/cars/:id', (req, res) => {
    try {
      const { id } = req.params;
    
      if (!cars[id-1]) {
        return res.status(404).json({ message: 'Car not found' });
      }
      delete cars[id-1];
      res.status(200).json({ message: 'Car deleted successfully' });
    } catch (err) {
      handleError(err, res);
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});