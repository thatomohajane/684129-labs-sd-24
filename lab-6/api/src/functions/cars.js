const { app } = require('@azure/functions');
const fs = require('fs').promises;

let cars;

fs.readFile('./cars.json', 'utf8')
  .then(data => {
    cars = JSON.parse(data);
  })
  .catch(err => {
    console.error('Error reading cars.json:', err);
  });

app.http('cars', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: async (context, req) => {
    if (req.method === 'GET') {
      return { body: cars };
    } else if (req.method === 'POST') {
      const newCar = req.body;
      cars.push(newCar);
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
      fs.writeFile('./cars.json', JSON.stringify(cars, null, 2), 'utf8');
      return { body: updatedCar };
    } else if (req.method === 'DELETE') {
      const index = cars.findIndex(car => car.id === id);
      cars.splice(index, 1);
      fs.writeFile('./cars.json', JSON.stringify(cars, null, 2), 'utf8');
      return { body: { message: `Car with id ${id} deleted` } };
    }
  }
});

module.exports = app;