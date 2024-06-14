import { useState } from 'react';
import propTypes from 'prop-types';
import './User.css';

const User = ({ id, username, email, isAdmin }) => {
    const [admin, setAdmin] = useState(isAdmin);

    function reassignUser() {
        try {
            const userId = JSON.parse(localStorage.getItem('user'))._id;
            if (userId === id) return alert('You cannot reassign yourself!');

            fetch('http://localhost:8080/reassign', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ id, isAdmin: admin})
                }
            )
            .then(response => response.json())
            .then(() => setAdmin(!admin))
            .catch(error => console.error(error));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <tr>
            <td>{username}</td>
            <td>{email}</td>
            <td>{admin ? 'Yes' : 'No'}</td>
            <td>
                <button onClick={reassignUser}><i className={admin ? "fa-solid fa-user-minus" : "fa-solid fa-user-plus"}></i></button>
            </td>
        </tr>
    );
}

User.propTypes = {
    id: propTypes.string.isRequired,
    username: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    isAdmin: propTypes.bool.isRequired
};

export default User;