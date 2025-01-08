import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import * as tmdbService from '../services/tmdb.js';

vi.mock('../services/tmdb.js');

describe('Movies API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return movies with editors for a valid year', async () => {
    const mockMovies = [{
      id: 1,
      title: 'Test Movie',
      release_date: '2019-01-01',
      vote_average: 8.5
    }];

    const mockCredits = {
      crew: [
        { known_for_department: 'Editing', name: 'John Editor' },
        { known_for_department: 'Sound', name: 'Sound Person' }
      ]
    };

    vi.spyOn(tmdbService, 'getMoviesByYear').mockResolvedValue(mockMovies);
    vi.spyOn(tmdbService, 'getMovieCredits').mockResolvedValue(mockCredits);

    const response = await request(app)
      .get('/api/movies')
      .query({ year: '2019' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toEqual({
      title: 'Test Movie',
      release_date: 'January 1, 2019',
      vote_average: 8.5,
      editors: ['John Editor']
    });
  });

  it('should handle missing editors gracefully', async () => {
    const mockMovies = [{
      id: 1,
      title: 'Test Movie',
      release_date: '2019-01-01',
      vote_average: 8.5
    }];

    vi.spyOn(tmdbService, 'getMoviesByYear').mockResolvedValue(mockMovies);
    vi.spyOn(tmdbService, 'getMovieCredits').mockRejectedValue(new Error('API Error'));

    const response = await request(app)
      .get('/api/movies')
      .query({ year: '2019' });

    expect(response.status).toBe(200);
    expect(response.body[0]).not.toHaveProperty('editors');
  });

  it('should validate year format', async () => {
    const response = await request(app)
      .get('/api/movies')
      .query({ year: 'invalid' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});