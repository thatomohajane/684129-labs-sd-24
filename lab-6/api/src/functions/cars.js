const { app } = require('@azure/functions');

// Define the cars data directly within the same file
const cars = [
    {
        "id": 1,
        "make": "Toyota",
        "model": "Camry",
        "year": 2022,
        "price": 250000
    },
    {
        "id": 2,
        "make": "Honda",
        "model": "Accord",
        "year": 2021,
        "price": 200000
    },
    {
        "id": 3,
        "make": "Ford",
        "model": "Mustang",
        "year": 2020,
        "price": 300000
    }
];

app.http('cars', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (context, req) => {
        if (req.method === 'GET') {
            return { body: cars }; // Return the cars data when a GET request is received
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
            const car = cars.find(car => car.id == id);
            if (car) {
                return { body: car };
            } else {
                return { status: 404, body: { message: `Car with id ${id} not found` } };
            }
        } else if (req.method === 'PUT') {
            const updatedCar = req.body;
            const index = cars.findIndex(car => car.id == id);
            if (index !== -1) {
                cars[index] = updatedCar;
                return { body: updatedCar };
            } else {
                return { status: 404, body: { message: `Car with id ${id} not found` } };
            }
        } else if (req.method === 'DELETE') {
            const index = cars.findIndex(car => car.id == id);
            if (index !== -1) {
                cars.splice(index, 1);
                return { body: { message: `Car with id ${id} deleted` } };
            } else {
                return { status: 404, body: { message: `Car with id ${id} not found` } };
            }
        }
    }
});
