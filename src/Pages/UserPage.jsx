import React, { useContext, useState } from 'react';
import { UserContext } from '../utils/UserContext';
import { getRulesets } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [gameId, setGameId] = useState('');
  const [rulesets, setRulesets] = useState([]);

  const gameIds = [
    'KingsCup',
    'RideTheBus',
    'Snap',
    'Trivia',
    'PromptDash',
    'DiceRoll',
    'DrinkRoulette',
    'AIBartender',
    'BountyBlast',
  ];

  const handleSelectChange = (event) => {
    setGameId(event.target.value);
  };

  const fetchAndSetRulesets = async () => {
    console.log('User object:', user);
    if (gameId) {
      console.log(
        `Fetching rulesets for user ID: ${user.user_id} and game ID: ${gameId}`
      );
      const rulesets = await getRulesets(user.user_id, gameId);
      console.log('Received rulesets from backend:', rulesets);
      setRulesets(rulesets);
    }
  };

  const handleLogout = () => {
    setUser(null);

    sessionStorage.removeItem('user');

    navigate('/');
  };

  return (
    <div className='h-full bg-base-100 p-8'>
      <button onClick={handleLogout} className='btn btn-error mb-4'>
        Logout
      </button>
      <div className='mb-4'>
        <p className='mb-2'>
          <span className='font-bold '>ID:</span> {user.user_id}
        </p>
        <p className='mb-2 '>
          <span className='font-bold '>Username:</span> {user.username}
        </p>
        <p className='mb-2'>
          <span className='font-bold '>Email:</span> {user.email}
        </p>
      </div>
      <div className='w-full max-w-xs'>
        <select
          className='select select-bordered w-full'
          value={gameId}
          onChange={handleSelectChange}
        >
          <option disabled value=''>
            Select a game
          </option>
          {gameIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <button className='btn btn-primary mt-4' onClick={fetchAndSetRulesets}>
          Fetch
        </button>
      </div>
      <div className='mt-8'>
        {rulesets.map((ruleset) => (
          <div
            key={ruleset.ruleset_id}
            className='mb-4 p-4 bg-base-100 rounded shadow'
          >
            <div className='flex  items-center mb-4'>
              <h2 className='font-bold text-lg mr-4 text-primary'>
                {ruleset.name}
              </h2>
              <p className='text-gray-500'>ID: {ruleset.ruleset_id}</p>
            </div>
            {Object.values(ruleset.rules).map((rule, index) => (
              <div key={`${ruleset.ruleset_id}-${index}`} className='mb-4'>
                <h3 className='text-xl font-semibold mb-1'>{rule.result}</h3>
                <h4>{rule.title}</h4>
                <p>{rule.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
