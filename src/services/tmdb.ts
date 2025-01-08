import axios from 'axios';
import { TMDBMovie, TMDBCredits } from '../types.js';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
  throw new Error('TMDB_API_KEY is required');
}

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

export async function getMoviesByYear(year: number): Promise<TMDBMovie[]> {
  const response = await tmdbClient.get('/discover/movie', {
    params: {
      language: 'en-US',
      page: 1,
      primary_release_year: year,
      sort_by: 'popularity.desc',
    },
  });
  return response.data.results;
}

export async function getMovieCredits(movieId: number): Promise<TMDBCredits> {
  const response = await tmdbClient.get(`/movie/${movieId}/credits`);
  return response.data;
}