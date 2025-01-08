import 'dotenv/config';
import express from 'express';
import movieRoutes from './routes/movies.js';

const app = express();
const port = process.env.PORT || 3000;

app.use('/api/movies', movieRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;