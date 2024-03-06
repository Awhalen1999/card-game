// todo: fix rules button for dropdown menu

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeOptions from './ThemeOptions';
import KingsCupRules from './Games/KingsCup/KingsCupRules.js';
import RideTheBusRules from './Games/RideTheBus/RideTheBusRules.js';
import SnapRules from './Games/Snap/SnapRules.js';
import TriviaRules from './Games/Trivia/TriviaRules.js';
import PromptDashRules from './Games/PromptDash/PromptDashRules.js';
import DiceRollRules from './Games/DiceRoll/DiceRollRules';
import DrinkRouletteRules from './Games/DrinkRoulette/DrinkRouletteRules.js';
import BountyBlastRules from './Games/BountyBlast/BountyBlastRules.js';
import { FaWrench } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';

const Nav = () => {
  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem('theme') || 'mydark'
  );
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isGamePage = location.pathname === '/GamePage';

  useEffect(() => {
    localStorage.setItem('theme', selectedTheme);
  }, [selectedTheme]);

  const gameRules = {
    '/games/KingsCup': KingsCupRules,
    '/games/RideTheBus': RideTheBusRules,
    '/games/Snap': SnapRules,
    '/games/Trivia': TriviaRules,
    '/games/PromptDash': PromptDashRules,
    '/games/DiceRoll': DiceRollRules,
    '/games/DrinkRoulette': DrinkRouletteRules,
    '/games/BountyBlast': BountyBlastRules,
  };

  const gameTitlesButton = {
    '/games/KingsCup': 'Kings Cup Rules',
    '/games/RideTheBus': 'Ride The Bus Rules',
    '/games/Snap': 'Snap Rules',
    '/games/Trivia': 'Trivia Rules',
    '/games/PromptDash': 'Prompt Dash Rules',
    '/games/DiceRoll': 'Dice Roll Rules',
    '/games/DrinkRoulette': 'Drink Roulette Rules',
    '/games/BountyBlast': 'Bounty Blast Rules',
  };

  const gameTitles = {
    '/games/KingsCup': 'Kings Cup',
    '/games/RideTheBus': 'Ride The Bus',
    '/games/Snap': 'Snap',
    '/games/Trivia': 'Trivia',
    '/games/PromptDash': 'Prompt Dash',
    '/games/DiceRoll': 'Dice Roll',
    '/games/DrinkRoulette': 'Drink Roulette',
    '/games/AIBartender': 'AI Bartender',
    '/games/BountyBlast': 'Bounty Blast',
  };

  const gamesWithIcon = new Set([
    '/games/KingsCup',
    '/games/DiceRoll',
    '/games/DrinkRoulette',
  ]);

  const openModal = () => {
    const modalId = `${location.pathname.slice(1)}-rules`;
    document.getElementById(modalId).showModal();
  };

  const isNotGamePage = !(
    location.pathname.includes('games') &&
    !location.pathname.endsWith('AIBartender')
  );

  return (
    <div className='navbar bg-base-100 border-b border-secondary h-20 font-space'>
      {/* left */}
      <div className='navbar-start'>
        <div className='dropdown'>
          <div
            tabIndex={0}
            role='button'
            className='btn btn-ghost lg:hidden text-base-content'
          >
            <HiOutlineMenuAlt3 className='h-5 w-5 text-current' />
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content mt-3 z-[10] p-2 shadow bg-base-100 rounded-box w-52 text-base-content font-semibold'
          >
            <li>
              {!isGamePage && (
                <button className='btn btn-ghost'>
                  <Link to='/GamePage'>Games</Link>
                </button>
              )}
            </li>
            <li>
              {!isNotGamePage && (
                <button className='btn btn-ghost' onClick={openModal}>
                  {gameTitlesButton[location.pathname]}
                  {gamesWithIcon.has(location.pathname) && (
                    <FaWrench className='ml-2' size={18} />
                  )}
                </button>
              )}
            </li>
            <li>
              <button
                className='dropdown relative btn btn-ghost'
                tabIndex={0}
                role='button'
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              >
                <div className='text-base-content'>
                  Theme
                  <IoMdArrowDropdown className='h-6 w-6 ml-2 text-current inline-block' />
                </div>
                {isThemeDropdownOpen && (
                  <ThemeOptions
                    selectedTheme={selectedTheme}
                    setSelectedTheme={setSelectedTheme}
                  />
                )}
              </button>
            </li>
          </ul>
        </div>
        <div className='navbar bg-base-100'>
          {isHomePage ? (
            <span className='text-3xl font-bold ml-2 font-pixel'>
              GameOn Tap
            </span>
          ) : (
            <Link to='/' className='btn btn-ghost text-3xl font-pixel'>
              GameOn Tap
            </Link>
          )}
        </div>
      </div>
      {/* center */}
      <div className='navbar-center hidden lg:flex text-2xl font-bold text-primary'>
        {location.pathname.includes('games') && gameTitles[location.pathname]}
      </div>
      {/* right */}
      <div className='navbar-end'>
        <ul className='menu menu-horizontal px-1 text-base-content font-semibold hidden lg:flex'>
          {!isGamePage && (
            <li>
              <Link to='/GamePage' className='btn btn-ghost mr-2'>
                Games
              </Link>
            </li>
          )}
          {!isNotGamePage && (
            <button className='btn btn-ghost' onClick={openModal}>
              {gameTitlesButton[location.pathname]}
              {gamesWithIcon.has(location.pathname) && (
                <FaWrench className='ml-2' size={18} />
              )}
            </button>
          )}
          <li>
            <div className='dropdown relative btn btn-ghost flex items-center justify-center ml-2'>
              <div tabIndex={0} role='button' className='text-base-content'>
                Theme
                <IoMdArrowDropdown className='h-6 w-6 ml-2 text-current inline-block' />
              </div>
              <ThemeOptions
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
              />
            </div>
          </li>
        </ul>
        <li className='menu menu-horizontal px-1 text-base-content font-semibold'>
          <a className=' btn-outline btn ml-2'>Login</a>
        </li>
      </div>
      <dialog
        id={`${location.pathname.slice(1)}-rules`}
        className='modal modal-bottom sm:modal-middle'
      >
        <div className='modal-box p-0'>
          {/* navbar */}
          <div className='navbar bg-base-100 sticky top-0 px-5'>
            <div className='flex-1'>
              <h3 className='font-bold text-lg'>
                {gameTitles[location.pathname]}
              </h3>
            </div>
            <div className='flex-none'>
              <ul className='menu menu-horizontal px-1'>
                <li>
                  {gamesWithIcon.has(location.pathname) && (
                    <button
                      className='btn'
                      onClick={() =>
                        navigate(`/EditRules/${location.pathname.slice(7)}`)
                      }
                    >
                      Edit Rules <FaWrench className='ml-2' size={18} />
                    </button>
                  )}
                </li>
                <li>
                  <button
                    className='btn ml-2'
                    onClick={() =>
                      document
                        .getElementById(`${location.pathname.slice(1)}-rules`)
                        .close()
                    }
                  >
                    Close
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className='p-4'>
            {gameRules[location.pathname] &&
              Object.values(gameRules[location.pathname]).map(
                (rule, index, self) => (
                  <React.Fragment key={index}>
                    <div className='flex flex-col items-center'>
                      <strong className='text-xl mb-2 '>{rule.result}</strong>
                      <div className='text-lg'>
                        <strong>{rule.title}</strong>: {rule.description}
                      </div>
                    </div>
                    {index < self.length - 1 && <div className='divider'></div>}
                  </React.Fragment>
                )
              )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Nav;
