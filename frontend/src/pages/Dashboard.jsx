import { useEffect, useState } from 'react';
import './Dashboard.css';
import User from '../components/User';

const Home = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setUsers(data || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = async (event) => {
        const searchTerm = event.target.value;
        try {
            const response = await fetch(`http://localhost:8080/users?search=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setUsers(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main>
            <h1>Dashboard</h1>

            <input type="text" id="search" placeholder="Search user" onChange={handleSearch} />

            <div id="users">
                <table>
                    <tbody>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Reassign</th>
                        </tr>
                        {users.map(user => (
                            <User key={user._id} id={user._id} username={user.username} email={user.email} isAdmin={user.isAdmin} />
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default Home;