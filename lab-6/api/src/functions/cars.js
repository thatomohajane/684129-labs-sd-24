const { app } = require('@azure/functions');
const fs = require('fs').promises;

// Import the file system module
let cars; // Declare a variable to store the cars data

// Load cars data from cars.json when the script starts
fs.readFile('./cars.json', 'utf8')
  .then(data => {
    cars = JSON.parse(data); // Parse JSON data and store it in the cars variable
  })
  .catch(err => {
    console.error('Error reading cars.json:', err);
  });

// Create a route for the function app
app.route('/api/cars', 'GET', async (context, req) => {
  return { body: cars }; // Return the cars data when a GET request is received
});

app.route('/api/cars', 'POST', async (context, req) => {
  const newCar = req.body;
  cars.push(newCar);

  // Save updated cars data back to cars.json (if needed)
  fs.writeFile('./cars.json', JSON.stringify(cars, null, 2), 'utf8');

  return { body: newCar };
});

app.route('/api/cars/:id', 'GET', async (context, req) => {
  const id = req.params.id;
  const car = cars.find(car => car.id === id);
  return { body: car };
});

app.route('/api/cars/:id', 'PUT', async (context, req) => {
  const id = req.params.id;
  const updatedCar = req.body;
  const index = cars.findIndex(car => car.id === id);
  cars[index] = updatedCar;

  // Save updated cars data back to cars.json (if needed)
  fs.writeFile('./cars.json', JSON.stringify(cars, null, 2), 'utf8');

  return { body: updatedCar };
});

app.route('/api/cars/:id', 'DELETE', async (context, req) => {
  const id = req.params.id;
  const index = cars.findIndex(car => car.id === id);
  cars.splice(index, 1);

  // Save updated cars data back to cars.json (if needed)
  fs.writeFile('./cars.json', JSON.stringify(cars, null, 2), 'utf8');

  return { body: { message: `Car with id ${id} deleted` } };
});