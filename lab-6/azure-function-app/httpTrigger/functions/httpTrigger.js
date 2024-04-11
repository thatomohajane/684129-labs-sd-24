const { app } = require('@azure/functions');
const cars = require('../cars.json');

app.http('cars', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (context, req) => {
        if (req.method === 'GET') {
            return { body: cars };
        } else if (req.method === 'POST') {
            const newCar = req.body;
            cars.push(newCar);
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
            return { body: updatedCar };
        } else if (req.method === 'DELETE') {
            const index = cars.findIndex(car => car.id === id);
            cars.splice(index, 1);
            return { body: { message: `Car with id ${id} deleted` } };
        }
    }
});
