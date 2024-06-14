import propTypes from 'prop-types';
import toast from 'react-hot-toast';
import './MovieCard.css';
import '../variables.css';

const MovieCard = ({ cover, title, year, len, genre, score, votes, onClick }) => {
    function handleMoreInfo() {
        toast(`${title} was released in ${year} and has a runtime of ${len}. It is a ${genre} movie with a score of ${score} based on ${votes} reviews.`, {//\n${description}`, {
            icon: '🎬',
            style: {
                borderRadius: '1rem',
                background: 'var(--secondary)',
                color: 'var(--contrast)',
                duration: 5000,
            },
        });
    }

    return (
        <div className="card">
            <div id="card-cover">
                <img src={`http://localhost:8080${cover}`} alt={title} className="card-img" onClick={onClick} />
            </div>
            <div id="card-content">
                <p id="card-score"><i className="fa-solid fa-avocado"></i>&ensp;{score}&ensp;<span>(reviews: {votes})</span></p>
                <p id="card-title" onClick={handleMoreInfo} >{title}</p>
            </div>
        </div>
    );
};

MovieCard.propTypes = {
    cover: propTypes.string.isRequired,
    score: propTypes.string.isRequired,
    title: propTypes.string.isRequired,
    year: propTypes.number.isRequired,
    len: propTypes.string.isRequired,
    genre: propTypes.string.isRequired,
    votes: propTypes.number.isRequired,
    onClick: propTypes.func.isRequired,
};

export default MovieCard;