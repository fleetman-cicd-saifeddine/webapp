const express = require('express');
const app = express();

app.use(express.json());

// ISSUE 1: Code Duplication - Same function repeated
function validateVehicle(vehicle) {
  if (!vehicle.id) return false;
  if (!vehicle.name) return false;
  if (!vehicle.status) return false;
  return true;
}

function validateVehicleAgain(vehicle) {
  if (!vehicle.id) return false;
  if (!vehicle.name) return false;
  if (!vehicle.status) return false;
  return true;
}

// ISSUE 2: Unused variable
const unusedConfig = {
  timeout: 5000,
  retries: 3
};

// ISSUE 3: Hardcoded configuration (should use env vars)
const CONFIG = {
  apiTimeout: 5000,
  maxRetries: 3,
  dbHost: 'localhost',
  dbPort: 5432
};

// ISSUE 4: Complex function (High complexity)
function complexCalculation(a, b, c, d, e) {
  if (a > 0) {
    if (b > 0) {
      if (c > 0) {
        if (d > 0) {
          if (e > 0) {
            return a + b + c + d + e;
          } else {
            return a + b + c + d;
          }
        } else {
          return a + b + c;
        }
      } else {
        return a + b;
      }
    } else {
      return a;
    }
  } else {
    return 0;
  }
}

// ISSUE 5: Missing error handling
app.get('/', (req, res) => {
  const data = JSON.parse(req.query.data);
  res.json({ message: 'Fleet Management System', data: data });
});

// ISSUE 6: Unreachable code
app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date() });
  console.log('This line will never execute');
  return;
});

// ISSUE 7: Unused parameter
app.post('/api/vehicles', (req, res, next) => {
  const vehicle = req.body;
  if (validateVehicle(vehicle)) {
    res.status(201).json(vehicle);
  } else {
    res.status(400).json({ error: 'Invalid vehicle' });
  }
});

// ISSUE 8: Magic numbers (should be constants)
app.get('/api/vehicles', (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  
  if (page > 100) {
    res.status(400).json({ error: 'Page too high' });
  }
  if (limit > 50) {
    res.status(400).json({ error: 'Limit too high' });
  }
  
  res.json({ vehicles: [], page: page, limit: limit });
});

// ISSUE 9: Inconsistent naming conventions
const vehicleList = [];
const vehicle_cache = {};
const VehicleStore = {};

// ISSUE 10: Missing input validation
app.post('/api/update', (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const status = req.body.status;
  
  // No validation - could cause issues
  vehicleList[id] = { name: name, status: status };
  res.json({ success: true });
});

// ISSUE 11: Deprecated error handler pattern
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ISSUE 12: No input sanitization
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  // Directly using user input without sanitization
  const results = vehicleList.filter(v => v.name.includes(query));
  res.json(results);
});

// ISSUE 13: Duplicate code block
function processVehicle(vehicle) {
  if (!vehicle.id) return null;
  if (!vehicle.name) return null;
  if (!vehicle.status) return null;
  return vehicle;
}

function processVehicleData(vehicle) {
  if (!vehicle.id) return null;
  if (!vehicle.name) return null;
  if (!vehicle.status) return null;
  return vehicle;
}

// ISSUE 14: No null/undefined checks
app.post('/api/batch', (req, res) => {
  const vehicles = req.body.vehicles;
  vehicles.forEach(v => {
    vehicleList.push(v);
  });
  res.json({ count: vehicles.length });
});

// ISSUE 15: Cognitive complexity
function calculatePrice(type, quantity, discount, tax, shipping) {
  let price = 0;
  if (type === 'standard') {
    if (quantity > 100) {
      if (discount > 0.2) {
        if (tax > 0.1) {
          if (shipping > 50) {
            price = quantity * 10 * (1 - discount) * (1 + tax) + shipping;
          } else {
            price = quantity * 10 * (1 - discount) * (1 + tax) + shipping;
          }
        }
      }
    }
  }
  return price;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
