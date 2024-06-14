import { useState } from 'react';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            window.location.href = '/';
        } else {
            setMessage(result.message);
        }
    };

    return (
        <main id="logmain">
            <p>{message}</p>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" id="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                <input type="password" name="password" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            <p>You don&apos;t have an account? <a href="/signup">Sign up</a> here.</p>            
        </main>
    );
};

export default Login;