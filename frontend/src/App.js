import './App.css';
import {BrowserRouter, BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import Login from './pages/LoginPage';
import Home from '../src/pages/HomePage';
import Register from '../src/pages/RegisterPage';
function App() {
  return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path='home' element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
          </Routes>
        </Router>
      </div>
  );
}

export default App;
