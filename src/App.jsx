import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage.jsx';
import KingsCup from './components/KingsCup.jsx';
import RideTheBus from './components/RideTheBus.jsx';
import Snap from './components/Snap.jsx';
import Trivia from './components/Trivia.jsx';
import PromptDash from './components/PromptDash.jsx';
import DiceRoll from './components/DiceRoll.jsx';
import DrinkRoulette from './components/DrinkRoulette/DrinkRoulette.jsx';
import AIbartender from './components/AIBartender.jsx';

/**
 * /games -> toolbar/common ui
 *  - /games/kings-cup ->
 */
const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<HomePage />} exact />
          <Route path='/KingsCup' element={<KingsCup />} />
          <Route path='/RideTheBus' element={<RideTheBus />} />
          <Route path='/Snap' element={<Snap />} />
          <Route path='/Trivia' element={<Trivia />} />
          <Route path='/PromptDash' element={<PromptDash />} />
          <Route path='/DiceRoll' element={<DiceRoll />} />
          <Route path='/DrinkRoulette' element={<DrinkRoulette />} />
          <Route path='/AIBartender' element={<AIbartender />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

/**
 * [us_en.txt]
 * title="My Awesome App"
 *
 * [ca_fr.txt]
 * title
 */
