import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import ApplyCoupon from './components/ApplyCoupon';
import CouponsManage from './components/CouponsManage';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // if the user successfully logged in
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);

  }
  return (
    <div className="App">
      <header className="App-header">
        {/* {isLoggedIn ? (
          <h2>Admin Page</h2>
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )} */}
        <Routes>
          <Route path="/" element={<ApplyCoupon />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/coupon-management" element={<CouponsManage />} />

        </Routes>
      </header>
    </div>
  );
}

export default App;
