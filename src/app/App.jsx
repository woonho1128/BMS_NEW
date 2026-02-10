import React from 'react';
import { AuthProvider } from './providers/AuthProvider';
import { Router } from '../router';
import '../shared/styles/globals.css';

export function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
