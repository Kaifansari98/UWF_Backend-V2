import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // ✅ import cors
import apiRouter from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow CORS from frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

app.use('/api', apiRouter);

app.get('/', (_req, res) => {
  res.send('Welcome to UWF Backend V2 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
