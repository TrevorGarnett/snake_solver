import './App.css';
import './snake/style.css';
import SnakeGame from './snake/SnakeGame.mjs';
import { React, useState } from 'react';

function App() {
  return (
    <div>
      <SnakeGame />
    </div>
  );
}

export default App;
