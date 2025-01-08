import express from 'express';
import asyncHandler from 'express-async-handler';
import { getMovies } from '../controllers/movies.js';

const router = express.Router();

router.get('/', (req, res, next) => {
    asyncHandler(getMovies)(req, res, next);
});

export default router;
