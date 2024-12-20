
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchFilms = createAsyncThunk('films/fetchFilms', async () => {
  const response = await fetch('https://swapi.py4e.com/api/films/?format=json');
  const data = await response.json();
  return data.results;  
});

const filmsSlice = createSlice({
  name: 'films',
  initialState: {
    films: [],
    status: 'idle',  
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFilms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.films = action.payload;
      })
      .addCase(fetchFilms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export default filmsSlice.reducer;
