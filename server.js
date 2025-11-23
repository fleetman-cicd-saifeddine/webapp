const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'webapp' });
});

app.get('/api/status', (req, res) => {
  res.json({
    message: 'Fleetman Webapp API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Webapp server running on port ${PORT}`);
});