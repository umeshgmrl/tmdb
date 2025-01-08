import { Request, Response } from 'express';
import { z } from 'zod';
import { getMoviesByYear, getMovieCredits } from '../services/tmdb.js';
import { Movie } from '../types.js';

const yearSchema = z.object({
  year: z.string().regex(/^\d{4}$/).transform(Number),
});

export async function getMovies(req: Request, res: Response) {
  const result = yearSchema.safeParse(req.query);
  
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid year format. Use YYYY.' });
  }

  const { year } = result.data;
  const movies = await getMoviesByYear(year);
  
  const moviesWithEditors = await Promise.all(
    movies.map(async (movie) => {
      const movieData: Movie = {
        title: movie.title,
        release_date: new Date(movie.release_date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        vote_average: movie.vote_average,
      };

      try {
        const credits = await getMovieCredits(movie.id);
        const editors = credits.crew
          .filter(person => person.known_for_department === 'Editing')
          .map(editor => editor.name);
        
        if (editors.length > 0) {
          movieData.editors = editors;
        }
      } catch (error) {
        // Silently continue if credits API fails
        console.error(`Failed to fetch credits for movie ${movie.id}:`, error);
      }

      return movieData;
    })
  );

  res.json(moviesWithEditors);
}