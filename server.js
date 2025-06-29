const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Record = require('./models/Record');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection with better error handling
mongoose.connect('mongodb://localhost:27017/medicord', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Add a record
app.post('/api/records', async (req, res) => {
  try {
    const record = new Record(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

// Get all records for a patient
app.get('/api/records/:patientAddress', async (req, res) => {
  try {
    const records = await Record.find({ patientAddress: req.params.patientAddress })
      .sort({ timeStamp: -1 }); // Sort by timestamp descending (newest first)
    res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Get all records (for admin purposes)
app.get('/api/records', async (req, res) => {
  try {
    const records = await Record.find().sort({ timeStamp: -1 });
    res.json(records);
  } catch (error) {
    console.error('Error fetching all records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Update a record
app.put('/api/records/:id', async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// Delete a record
app.delete('/api/records/:id', async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// Get record by ID
app.get('/api/records/id/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ error: 'Failed to fetch record' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MediCord API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
