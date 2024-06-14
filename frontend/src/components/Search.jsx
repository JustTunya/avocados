import { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import './Search.css'

const Search = ({ onSearch }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:8080/genres');
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const handleSearchChange = () => {
      fetch('http://localhost:8080/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: document.getElementById('titel-search').value,
          genre: document.getElementById('genre-search').value,
          minYear: document.getElementById('start-year').value,
          maxYear: document.getElementById('end-year').value,
        }),
      })
        .then((response) => response.json())
        .then((data) => onSearch(data))
        .catch((error) => console.error(error));
    };

    const titleInp = document.getElementById('titel-search');
    const genreInp = document.getElementById('genre-search');
    const minYearInp = document.getElementById('start-year');
    const maxYearInp = document.getElementById('end-year');

    titleInp.addEventListener('input', handleSearchChange);
    genreInp.addEventListener('change', handleSearchChange);
    minYearInp.addEventListener('input', handleSearchChange);
    maxYearInp.addEventListener('input', handleSearchChange);

    return () => {
      titleInp.removeEventListener('input', handleSearchChange);
      genreInp.removeEventListener('change', handleSearchChange);
      minYearInp.removeEventListener('input', handleSearchChange);
      maxYearInp.removeEventListener('input', handleSearchChange);
    };
  }, [onSearch]);
  
  return (
    <div id="search">
      <input type="text" name="title" id="titel-search" placeholder="Search by title" />
      <select name="genre" id="genre-search">
        <option key="default" value="">Search by genre</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>
      <div id="years">
        <input type="number" name="start" id="start-year" min="1878" max="2024" placeholder="1878" />
        <span> - </span>
        <input type="number" name="end" id="end-year" min="1878" max="2024" placeholder="2024" />
      </div>
    </div>
  );
};

Search.propTypes = {
  onSearch: propTypes.func.isRequired,
};

export default Search;