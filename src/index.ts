import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// ⬇️ All routes prefixed with /api
app.use('/api', apiRouter);
    
app.get('/', (_req, res) => {
  res.send('Welcome to UWF Backend V2 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
