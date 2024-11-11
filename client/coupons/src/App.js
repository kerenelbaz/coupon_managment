import { useState } from 'react';
import './App.css';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // if the user successfully logged in
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);

  }
  return (
    <div className="App">
      <header className="App-header">
        {isLoggedIn ? (
          <div>Admin Page</div>
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </header>
    </div>
  );
}

export default App;
