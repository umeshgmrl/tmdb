import express from 'express';
import asyncHandler from 'express-async-handler';
import { getMovies } from '../controllers/movies.js';

const router = express.Router();

router.get('/', asyncHandler(getMovies));

export default router;