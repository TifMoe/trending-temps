import React from 'react';
import Header from './components/Header'
import TempGraph from './components/TempGraph'
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <header className="App-content">
        <TempGraph />
      </header>
    </div>
  );
}

export default App;
