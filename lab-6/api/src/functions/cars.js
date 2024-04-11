const { app } = require('@azure/functions');
const fs = require('fs').promises; // Import the file system module

let cars; // Declare a variable to store the cars data

// Load cars data from cars.json when the script starts
fs.readFile('./cars.json', 'utf8')
    .then(data => {
        cars = JSON.parse(data); // Parse JSON data and store it in the cars variable
    })
    .catch(err => {
        console.error('Error reading cars.json:', err);
    });

app.http('cars', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (context, req) => {
        if (req.method === 'GET') {
            return { body: cars }; // Return the cars data when a GET request is received
        } else if (req.method === 'POST') {
            const newCar = req.body;
            cars.push(newCar);
            // Save updated cars data back to cars.json (if needed)
            fs.writeFile('./cars.json', JSON.stringify(cars, null, 2), 'utf8');
            return { body: newCar };
        }
    }
});

app.http('cars/{id}', {
    methods: ['GET', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (context, req) => {
        const id = req.params.id;
        if (req.method === 'GET') {
            const car = cars.find(car => car.id === id);
            return { body: car };
        } else if (req.method === 'PUT') {
            const updatedCar = req.body;
            const index = cars.findIndex(car => car.id === id);
            cars[index] = updatedCar;
            // Save updated cars data back to cars.json (if needed)
            fs.writeFile('./cars.json', JSON.stringify(cars, null, 2), 'utf8');
            return { body: updatedCar };
        } else if (req.method === 'DELETE') {
            const index = cars.findIndex(car => car.id === id);
            cars.splice(index, 1);
            // Save updated cars data back to cars.json (if needed)
            fs.writeFile('./cars.json', JSON.stringify(cars, null, 2), 'utf8');
            return { body: { message: `Car with id ${id} deleted` } };
        }
    }
});