import express from 'express';
import cors from 'cors';
import { config } from './config';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/error';

const app = express();

// Express setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Diagnostics route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Centralized API router mapping
app.use('/api', apiRouter);

// Global centralized error handler (must be placed at the end of the stack)
app.use(errorHandler);

// Bootstrap runner
const port = parseInt(config.PORT, 10);
app.listen(port, () => {
  console.log(`[BOOTSTRAP] Business Growth Operating System server running on port: ${port}`);
});

export default app;
