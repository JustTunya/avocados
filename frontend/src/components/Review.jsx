import propTypes from 'prop-types';
import './Review.css';
import '../variables.css';

const Review = ({ id, user, score, comment, type, onEvent }) => {
    const admin = JSON.parse(localStorage.getItem('user'))?.isAdmin;

    function handleDelete() {
        fetch(`http://localhost:8080/review/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        .then(response => {
            if (response.ok) {
                onEvent();
                document.getElementById(id).remove();
            } else {
                console.error('Error deleting review:', response);
            }
        })
        .catch(error => {
            console.error('Error deleting review:', error);
        });
    }

    const handleVerdict = (verdict) => {
        fetch(`http://localhost:8080/verdict`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, verdict }) })
        .then(response => {
            if (response.ok) {
                if (verdict === 'approve') {
                    document.getElementById('status').textContent = 'approved';
                } else {
                    document.getElementById('status').textContent = 'denied';
                }
                onEvent();
                document.getElementById('admin-controls').remove();
            } else {
                console.error('Error updating review:', response);
            }
        })
        .catch(error => {
            console.error('Error updating review:', error);
        });
    };

    return (
        <div className="review-card" id={id}>
            <div id="review-info">
                <p id="review-user"><i className="fa-solid fa-circle-user"></i>{user}</p>
                <p id="review-score"><i className="fa-solid fa-avocado"></i>{score}</p>
                <div id="controls">
                    {admin && type === "pending" && (
                        <div className="admin" id="admin-controls">
                            <i className="fa-solid fa-check" onClick={() => handleVerdict('approve')}></i>
                            <i className="fa-solid fa-xmark" onClick={() => handleVerdict('reject')}></i>
                        </div>
                    )}

                    <div id="user-controls">
                        {type === "pending" && <p id="status">pending</p>}
                        {(admin || user === (JSON.parse(localStorage.getItem('user'))?.username || 'guest')) && 
                            <i className="fa-solid fa-trash" onClick={handleDelete}></i>
                        }
                    </div>
                </div>
            </div>
            <div id="review-comment">
                <p>{comment}</p>
            </div>
            <br />
        </div>
    );
};

Review.propTypes = {
    id: propTypes.string.isRequired,
    user: propTypes.string.isRequired,
    score: propTypes.number.isRequired,
    comment: propTypes.string.isRequired,
    type: propTypes.string.isRequired,
    onEvent: propTypes.func.isRequired,
};

export default Review;