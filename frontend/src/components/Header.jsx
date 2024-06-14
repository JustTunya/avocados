import { Link } from 'react-router-dom';
import './Header.css';
import '../variables.css';

const Header = () => {
    const username = JSON.parse(localStorage.getItem('user'))?.username;
    const admin = JSON.parse(localStorage.getItem('user'))?.isAdmin;

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    function handleLogin() {
        window.location.href = '/login';
    }

    function handleSignup() {
        window.location.href = '/signup';
    }

    window.onload = () => {
        if (localStorage.getItem('token')) {
            document.getElementById('noauth').style.display = 'none';
            document.getElementById('auth').style.display = 'flex';
        } else {
            document.getElementById('noauth').style.display = 'flex';
            document.getElementById('auth').style.display = 'none';
        }
    }

    return (
        <header>
            <div id="masthead">
                <Link to="/"><h1>AVOCADOS&ensp;<i className="fa-solid fa-avocado"></i></h1></Link>

                <div id="noauth">
                    <button type="button" id="login" className="navlink" onClick={handleLogin}>LOGIN</button>
                    <button type="button" id="signup" className="navlink" onClick={handleSignup}>SIGNUP</button>
                </div>
                <div id="auth">
                    <p><i className="fa-solid fa-circle-user"></i>&ensp;{username}</p>
                    <button type="button" id="logout" className="navlink" onClick={handleLogout}>LOGOUT</button>
                </div>
            </div>

            {admin && (
                <nav className="admin" id="adminhead">
                    <p>[ ADMIN OPTIONS ]</p>
                    <ul>
                        <li><Link to="/upload">Upload movie</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;