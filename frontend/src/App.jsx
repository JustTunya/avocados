import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Movie from './pages/Movie';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Edit from './pages/Edit';
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route path="/upload" element={<Upload />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/movie/:id" element={<Movie />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/edit/:id" element={<Edit />}></Route>
      </Routes>
      <Toaster position="bottom-right" reverseOrder={false} />
    </Router>
  );
};

export default App;
