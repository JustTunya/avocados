import { useState } from 'react';
import axios from 'axios';
import './Upload.css';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [len, setLen] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState(null);

  const handleMovieUpload = async (event) => {
    event.preventDefault();

    const movie = new FormData();
    movie.append('title', title);
    movie.append('year', year);
    movie.append('genre', genre);
    movie.append('len', len);
    movie.append('description', description);
    movie.append('cover', cover);

    try {
      await axios.post('http://localhost:8080/upload', movie, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      window.location.replace(`/`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <form id="movie-upload" onSubmit={handleMovieUpload}>
        <h2>Movie</h2>
        <input type="text" id="title" value={title} name="title" placeholder="Movie title" onChange={(event) => setTitle(event.target.value)} required />
        <input type="number" id="year" value={year} name="year" min="1878" max="2024" placeholder="Relase year" onChange={(event) => setYear(event.target.value)} required />
        <input type="text" id="genre" value={genre} name="genre" placeholder="Movie genre" onChange={(event) => setGenre(event.target.value)} required />
        <input type="number" id="len" value={len} name="len" min="1" max="600" placeholder="Length of movie (minutes)" onChange={(event) => setLen(event.target.value)} required />
        <textarea id="description" value={description} name="description" placeholder="A brief description of the movie." onChange={(event) => setDescription(event.target.value)} required></textarea>
        <input type="file" id="cover" name="cover" placeholder="Movie cover (URL)" onChange={(event) => setCover(event.target.files[0])} required />
        <button type="submit">Upload</button>
      </form>
    </main>
  );
};

export default Upload;