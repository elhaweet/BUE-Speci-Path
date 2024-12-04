import React, { useState, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter.jsx';

export const AuthContext = createContext();

const App = () => {
  const [authState, setAuthState] = useState({
    isLoggedIn: !!localStorage.getItem('token'),
  });

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <AppRouter />
    </AuthContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
