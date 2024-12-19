import express from 'express';
import orchestrator from './services/openai/orchestrator';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('dist'));

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await orchestrator.processInput(message);
    res.json({ response });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
