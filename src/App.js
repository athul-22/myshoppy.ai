import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SearchScreen from './components/search/SearchScreen';
import ResultsScreen from './components/results/ResultsScreen';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchScreen />} />
        <Route path="/results" element={<ResultsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
