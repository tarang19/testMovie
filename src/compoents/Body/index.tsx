import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import { fetchFilms, fetchSingleFilm } from '../../features/films/filmsSlice';

interface Film {
  id: number;
  episode_id: number;
  title: string;
  release_date: string;
  opening_crawl: string;
  director: string;
}

interface FilmsState {
  films: Film[];
  selectedFilm: Film | null;
  filmsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  selectedFilmStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface RootState {
  films: FilmsState;
}

interface BodyProps {
  searchQuery: string;
  sortBy: string;
}

const Body: React.FC<BodyProps> = ({ searchQuery, sortBy }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [filteredFilms, setFilteredFilms] = useState<Film[]>([]);

  // Get the films data and selectedFilm from the Redux store
  const { films, filmsStatus, selectedFilm, selectedFilmStatus, error } = useSelector(
    (state: RootState) => state.films
  );

  // Fetch films data when component mounts
  useEffect(() => {
    if (filmsStatus === 'idle') {
      dispatch(fetchFilms());
    }
  }, [filmsStatus, dispatch]);

  // Filter and sort films based on search query and selected sort method
  useEffect(() => {
    let filtered = films;

    // Filter by search query
    if (searchQuery) {
      filtered = films.filter((film) =>
        film.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Clone the filtered array to avoid mutating the original array
    filtered = [...filtered]; 

    // Sort the films based on the selected sort method
    if (sortBy === 'year') {
      filtered.sort((a, b) => new Date(a.release_date).getFullYear() - new Date(b.release_date).getFullYear());
    } else if (sortBy === 'episode') {
      filtered.sort((a, b) => a.episode_id - b.episode_id);
    }

    setFilteredFilms(filtered);
  }, [searchQuery, films, sortBy]);

  // Handle film click and dispatch fetchSingleFilm action using the stable id
  const handleFilmClick = (id: string) => {
    const selectedFilmId = parseInt(id) - 1; // Use the stable `id` directly
    dispatch(fetchSingleFilm(selectedFilmId)); // Dispatch the selectedFilmId
  };

  return (
    <div className="grid grid-cols-12 gap-4 mx-auto p-5 mt-20">
     
      <div className="col-span-6 border-r-2 border-gray-300 h-screen overflow-y-auto">
        {filmsStatus === 'loading' && <h1>Loading film list...</h1>}
        {filmsStatus === 'failed' && <h1>{error}</h1>}
        {filmsStatus === 'succeeded' &&
          filteredFilms.length > 0 &&
          filteredFilms.map((film: Film) => (
            <div
              key={film.id} 
              className="grid grid-cols-3 gap-4 p-4 border-b-2 border-gray-300 cursor-pointer"
              id={`${film.id}`} 
              onClick={(e) => handleFilmClick(e.currentTarget.id)} 
            >
              <div className="p-4">
                <h4>EPISODE {film.episode_id}</h4>
              </div>
              <div className="p-4 title">
                <h1>{film.title}</h1>
              </div>
              <div className="p-4 text-right">
                <p>{film.release_date}</p>
              </div>
            </div>
          ))}
        {filteredFilms.length === 0 && <h2>No films found</h2>}
      </div>

      
      <div className="col-span-6 h-screen p-5">
        {selectedFilmStatus === 'loading' && <h1>Loading selected film...</h1>}
        {selectedFilmStatus === 'failed' && <h1>{error}</h1>}
        {selectedFilm && (
          <div>
            <h1 className='font-bold text-[20px]'>{selectedFilm.title}</h1>
            <p>{selectedFilm.opening_crawl}</p>
            <p>Release Date: {selectedFilm.release_date}</p>
            <p>Directed by: {selectedFilm.director}</p>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;
