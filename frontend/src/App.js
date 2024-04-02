import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Navbar, Home, Footer } from './utils/constants';
import CreatorDetails from './pages/CreatorDetails';
import FashionDetails from './pages/FashionDetails';
import Feeds from './componets/Dashboard/Feeds';
import LoginForm from './componets/accounts/LoginForm';
import RegisterForm from './componets/accounts/RegisterForm';
import CreateAccount from './pages/CreateAccount';
import Save from './pages/Save';
import { apiProxy } from './utils/constants';

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('accessToken') || null);
  const navigate = useNavigate(); 
  const [isCreator, setIsCreator] = useState(false);
  const [creators, setCreators] = useState([]);
  
  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/creators/creator/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setIsCreator(data.length > 0);
          setCreators(data);
        } else {
          setIsCreator(false);
        }
      } catch (error) {
        console.error("Error fetching creator data:", error);
      }
    };
  
    fetchCreatorData();
  }, [token]);
  
  const handleRegister = (access) => {
    setToken(access);
    localStorage.setItem('accessToken', access);
    navigate('/dashboard/');
  };

  const handleLogin = (access) => {
    setToken(access);
    localStorage.setItem('accessToken', access);
    navigate('/dashboard/');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('accessToken');
    navigate('/login/');
  };

  return (
    <div>
       <Navbar token={token} onLogout={handleLogout} isCreator={isCreator} />

      <Routes>
        <Route path='/' element={<Home/>} creators={creators}/>
        <Route path='/register' element={<RegisterForm onRegister={handleRegister} />} />
        <Route path='/login' element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/creator/:id" element={<CreatorDetails token={token}/>} />
        <Route path="/fashion/:id" element={<FashionDetails token={token}/>} />
        {token && <Route path='/creator/account/create/' element={<CreateAccount token={token}/>} />}
        {token && <Route path='/fashion/saved/' element={<Save token={token}/>} />}
        <Route path='/dashboard/' element={<Feeds token={token}  />} />
      </Routes>
      <div style={{ marginBottom: "150px" }}>
      <Footer />
      </div>
    </div>
  );
};

export default App;
