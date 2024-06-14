import { useState } from 'react';
import './Signup.css'

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password1 !== password2) {
            setMessage('Passwords do not match');
            return;
        }

        const response = await fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password1, password2 })
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = '/login';
        } else {
            setMessage(result.message);
        }
    };

    return (
        <main id="signmain">
            <p>{message}</p>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" id="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                <input type="email" name="email" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="password1" id="password1" placeholder="Password" onChange={(e) => setPassword1(e.target.value)} />
                <input type="password" name="password2" id="password2" placeholder="Confirm password" onChange={(e) => setPassword2(e.target.value)} />
                <button type="submit">Sign up</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a> here.</p>            
        </main>
    );
}

export default Signup;