import React from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../Context';

export default function ProtectedRoute({ children }) {
  const { user } = React.useContext(Context);

  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
}
