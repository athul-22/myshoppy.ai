import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SearchScreen from './components/search/SearchScreen';
import ResultsScreen from './components/results/ResultsScreen';
import RecommendationChat from './components/recommendation/RecommendationChat';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchScreen />} />
        <Route path="/results" element={<ResultsScreen />} />
        <Route path="/recommend" element={<RecommendationChat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
