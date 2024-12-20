import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ApiFilm {
    episode_id: number;
    title: string;
    release_date: string;
    opening_crawl: string;
  }

// Fetch all films
export const fetchFilms = createAsyncThunk(
    'films/fetchFilms',
    async () => {
      const response = await await axios.get<{ results: ApiFilm[] }>('https://swapi.py4e.com/api/films/?format=json');
      return response.data.results.map((film, index) => ({
        ...film,
        id: index + 1, 
      }));
    }
  );

// Fetch a single film by ID (with caching logic)
export const fetchSingleFilm = createAsyncThunk(
    'films/fetchSingleFilm',
    async (filmIndex: number, { getState }) => {
      
      const state = getState() as { films: FilmsState };
      const selectedFilm = state.films.films[filmIndex];
  
     
      if (selectedFilm) {
        return selectedFilm;
      }
  
    
      throw new Error('Film not found in the state');
    }
  );
  

// Initial state
interface Film {
  episode_id: number;
  title: string;
  release_date: string;
  opening_crawl: string;
}

interface FilmsState {
  films: Film[];
  selectedFilm: Film | null;
  filmsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  selectedFilmStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FilmsState = {
  films: [],
  selectedFilm: null,
  filmsStatus: 'idle',
  selectedFilmStatus: 'idle',
  error: null,
};

// Slice
const filmsSlice = createSlice({
  name: 'films',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetch films actions
      .addCase(fetchFilms.pending, (state) => {
        state.filmsStatus = 'loading';
      })
      .addCase(fetchFilms.fulfilled, (state, action) => {
        state.filmsStatus = 'succeeded';
        state.films = action.payload;
      })
      .addCase(fetchFilms.rejected, (state, action) => {
        state.filmsStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch films';
      })
      // Handling single film actions
      .addCase(fetchSingleFilm.pending, (state) => {
        state.selectedFilmStatus = 'loading';
      })
      .addCase(fetchSingleFilm.fulfilled, (state, action) => {
        state.selectedFilmStatus = 'succeeded';
        state.selectedFilm = action.payload;
      })
      .addCase(fetchSingleFilm.rejected, (state, action) => {
        state.selectedFilmStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch selected film';
      });
  },
});

export default filmsSlice.reducer;
