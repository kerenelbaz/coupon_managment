import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import ApplyCoupon from './components/ApplyCoupon';
import CouponsManage from './components/CouponsManage';
import Register from './components/Register';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<ApplyCoupon />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/coupon-management" element={<CouponsManage />} />
          <Route path="/Register" element={<Register />} />

        </Routes>
      </header>
    </div>
  );
}

export default App;
