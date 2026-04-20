const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data file path
const dataFile = path.join(__dirname, 'data', 'clients.json');

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.ensureDir(path.dirname(dataFile));
    const exists = await fs.pathExists(dataFile);
    if (!exists) {
      await fs.writeJson(dataFile, []);
    }
  } catch (error) {
    console.error('Error initializing data file:', error);
  }
}

// Helper functions
async function readClients() {
  try {
    return await fs.readJson(dataFile);
  } catch (error) {
    console.error('Error reading clients:', error);
    return [];
  }
}

async function writeClients(clients) {
  try {
    await fs.writeJson(dataFile, clients, { spaces: 2 });
  } catch (error) {
    console.error('Error writing clients:', error);
  }
}

// API Routes

// GET all clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await readClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// POST new client
app.post('/api/clients', async (req, res) => {
  try {
    const clients = await readClients();
    const newClient = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: req.body.status || 'pending'
    };
    clients.push(newClient);
    await writeClients(clients);
    res.json(newClient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add client' });
  }
});

// PUT update client
app.put('/api/clients/:id', async (req, res) => {
  try {
    const clients = await readClients();
    const index = clients.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    clients[index] = {
      ...clients[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await writeClients(clients);
    res.json(clients[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const clients = await readClients();
    const filteredClients = clients.filter(c => c.id !== req.params.id);
    await writeClients(filteredClients);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// GET dashboard stats
app.get('/api/dashboard', async (req, res) => {
  try {
    const clients = await readClients();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const stats = {
      total: clients.length,
      dueToday: clients.filter(c => {
        const dueDate = new Date(c.dueDate);
        return dueDate.toDateString() === today.toDateString();
      }).length,
      dueInThreeDays: clients.filter(c => {
        const dueDate = new Date(c.dueDate);
        return dueDate > today && dueDate <= threeDaysFromNow;
      }).length,
      overdue: clients.filter(c => {
        const dueDate = new Date(c.dueDate);
        return dueDate < today && c.status !== 'completed';
      }).length
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// GET today's follow-ups
app.get('/api/followups', async (req, res) => {
  try {
    const clients = await readClients();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const followups = clients.filter(c => {
      const dueDate = new Date(c.dueDate);
      return dueDate.toDateString() === today.toDateString() || 
             (dueDate < today && c.status !== 'completed');
    });
    
    res.json(followups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch follow-ups' });
  }
});

// Initialize and start server
initializeDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`GST Client Follow-up System running on http://localhost:${PORT}`);
  });
});
