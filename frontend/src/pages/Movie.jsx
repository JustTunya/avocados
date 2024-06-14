import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Review from '../components/Review';
import '../variables.css'
import './Movie.css';

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [pending, setPending] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [score, setScore] = useState('0.0');

  const admin = JSON.parse(localStorage.getItem('user'))?.isAdmin;

  useEffect (() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:8080/movie/${id}`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:8080/reviews/${id}/${JSON.parse(localStorage.getItem('user'))?._id || 'guest'}`);
        const data = await response.json();
        setPending(data.pendings || []);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchScore = async () => {
      try {
        const response = await fetch(`http://localhost:8080/score/${id}`);
        const data = await response.json();
        setScore(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovie();
    fetchScore();
    fetchReviews();
  }, [id]);

  function handleScore() {
    const fetchScore = async () => {
      try {
        const response = await fetch(`http://localhost:8080/score/${id}`);
        const data = await response.json();
        setScore(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchScore();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const movieId = id;
    const userId = JSON.parse(localStorage.getItem('user'))._id;
    const rating = event.target.score.value;
    const comment = event.target.comment.value;

    if (!movieId || !userId || !rating || !comment || rating < 1 || rating > 10) {
      return;
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:8080/reviews/${id}/${JSON.parse(localStorage.getItem('user'))._id}`);
        const data = await response.json();
        setPending(data.pendings || []);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error(error);
      }
    };

    try {
      await fetch(`http://localhost:8080/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ movieId, userId, rating, comment }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          console.error(data.message);
          localStorage.clear();
          window.location.href = '/login';
        }
      })
      .catch(error => console.error(error));

      event.target.reset();
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  function handleDelete() {
    const fetchDelete = async () => {
      try {
        await fetch(`http://localhost:8080/movie/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(response => {
          if (response.ok) {
            window.location.href = '/';
          } else {
            console.error('Error deleting movie:', response);
          }
        })
        .catch(error => console.error('Error deleting movie:', error));
      } catch (error) {
        console.error(error);
      }
    };

    fetchDelete();
  }

  function handleEdit() {
    window.location.href = `/edit/${id}`;
  }

  if (!movie || !reviews || !pending || !score) {
    return (
      <main id="loadmain">
        <i className="fa-solid fa-spinner-scale fa-spin-pulse"></i>
      </main>
    );
  }

  return (
    <main>
      <div id="basic">
        {admin ? (
          <div id="movie-header">
            <h1>{movie.title}</h1>
            <div id="movie-edit">
              <i className="fa-solid fa-pen-ruler" onClick={handleEdit}></i>&emsp;
              <i className="fa-solid fa-trash-can" onClick={handleDelete}></i>&emsp;
            </div>
          </div>
        ) : (
          <h1>{movie.title}</h1>
          )}
        <p>{movie.year}&ensp;•&ensp;{movie.genre}&ensp;•&ensp;{movie.len}</p>
      </div>
      
      <div id="container">
        <img src={`http://localhost:8080${movie.cover}`} alt={movie.title} id="poster" />
        <div id="additional">
          <h2><i className="fa-solid fa-avocado"></i>{score}</h2>
          <p>{movie.description}</p>
        </div>
      </div>

      <div id="review-section">
        <div className="logged-in" id="rev-inputs">
          {localStorage.getItem('token') && (
            <form id="review" onSubmit={handleSubmit}>
              <input type="number" name="score" id="score" min="1" max="10" placeholder="Score" />
              <textarea name="comment" id="comment" placeholder="Your opinion..."></textarea>
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
        { reviews.length > 0 || pending.length > 0 ? (
          <div id="rev-container">
            {pending.map((review) => (
              <Review key={review._id} id={review._id} user={review.user} score={review.rating} comment={review.comment} type="pending" onEvent={handleScore} />
            ))}
            {reviews.map((review) => (
              <Review key={review._id} id={review._id} user={review.user} score={review.rating} comment={review.comment} type="review" onEvent={handleScore} />
            ))}
          </div>
        ) :(
          <div id="no-rev">
            <p>No reviews yet...</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Movie;