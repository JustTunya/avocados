import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Search from '../components/Search';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:8080/');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/movie/${id}`);
  };

  function handleSearch(data) {
    setMovies(data);
  }

  return (
    <main>
        <Search onSearch={handleSearch} />
        <h1>Movies <span>&</span> TV shows</h1>
        <div className="container" id="default">
          {movies.map((movie) => (
            <MovieCard key={movie._id} cover={movie.cover} title={movie.title} year={movie.year} len={movie.len} genre={movie.genre} score={movie.score} votes={movie.votes} onClick={() => handleCardClick(movie._id)} />
          ))}
        </div>
    </main>
  );
};

export default Home;