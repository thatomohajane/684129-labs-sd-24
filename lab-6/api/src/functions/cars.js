const { AzureFunction, Context } = require('@azure/functions');
const express = require('express');
const app = express();

app.use(express.json());

const cars = require('./cars.json');

// Define your Express routes as usual
app.get('/api/cars', (req, res) => {
    res.json(cars);
});

app.get('/api/cars/:id', (req, res) => {
    const id = req.params.id;
    const car = cars.find(car => car.id === id);
    if (!car) {
        res.status(404).json({ error: 'Car not found' });
    } else {
        res.json(car);
    }
});

app.put('/api/cars/:id', (req, res) => {
    const id = req.params.id;
    const updatedCar = req.body;
    const index = cars.findIndex(car => car.id === id);
    if (index === -1) {
        res.status(404).json({ error: 'Car not found' });
    } else {
        cars[index] = updatedCar;
        res.json(updatedCar);
    }
});

app.delete('/api/cars/:id', (req, res) => {
    const id = req.params.id;
    const index = cars.findIndex(car => car.id === id);
    if (index === -1) {
        res.status(404).json({ error: 'Car not found' });
    } else {
        cars.splice(index, 1);
        res.json({ message: `Car with id ${id} deleted` });
    }
});

app.post('/api/cars', (req, res) => {
    const newCar = req.body;
    cars.push(newCar);
    res.status(201).json(newCar);
});

// Define your Azure Function
const httpTrigger = new AzureFunction(app);

module.exports = async function (context, req) {
    await httpTrigger.run(context, req);
};
