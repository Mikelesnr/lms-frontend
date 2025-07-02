import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from '../lib/axios';

export default function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    axios.get('/api/user')
      .then(res => {
        setUser(res.data);
        setChecking(false);
      })
      .catch(() => {
        setUser(null);
        setChecking(false);
      });
  }, []);

  if (checking) return null; // You could show a spinner here

  return user ? children : <Navigate to="/login" />;
}
