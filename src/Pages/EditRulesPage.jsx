import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TiDelete } from 'react-icons/ti';
import { MdKeyboardReturn } from 'react-icons/md';
import {
  getRulesets,
  saveRuleset,
  deleteRuleset,
  getActiveRuleset,
  setActiveRuleset,
} from '../utils/api';
import RuleEdit from './RuleEdit';

const EditRulesPage = () => {
  const [customRulesetTitle, setCustomRulesetTitle] = useState('');
  const [storedRulesets, setStoredRulesets] = useState({});
  const [currentRulesetTitle, setCurrentRulesetTitle] = useState('');
  const { game } = useParams();
  const [currentlyEditing, setCurrentlyEditing] = useState(null);
  const [editedRuleText, setEditedRuleText] = useState('');
  const [editedRuleSet, setEditedRuleSet] = useState([]);

  const handleSaveCustomRuleset = async () => {
    if (customRulesetTitle.trim() !== '') {
      try {
        await saveRuleset(game, customRulesetTitle, editedRuleSet);
        const updatedRulesets = await getRulesets(game);
        setStoredRulesets(updatedRulesets || {});
        setCurrentRulesetTitle(customRulesetTitle);
        await handleLoadSavedRuleset(customRulesetTitle);
        setCustomRulesetTitle('');
      } catch (error) {
        console.error('Failed to save ruleset:', error);
      }
    } else {
      alert('Please enter a title for your custom ruleset.');
    }
  };

  const handleDeleteRuleset = async (title) => {
    try {
      await deleteRuleset(game, title);
      const updatedSavedRulesets = await getRulesets(game);
      setStoredRulesets(updatedSavedRulesets || {});

      if (currentRulesetTitle === title) {
        const defaultRuleset = await getRulesets(game);
        setEditedRuleSet(defaultRuleset);
        setCurrentRulesetTitle('Default');
      }
    } catch (error) {
      console.error('Failed to delete ruleset:', error);
    }
  };

  const handleSubmit = () => {
    if (currentlyEditing) {
      setEditedRuleSet((prevRules) => {
        let newRules = JSON.parse(JSON.stringify(prevRules));
        newRules[currentlyEditing.key][currentlyEditing.type] = editedRuleText;
        return newRules;
      });
      setCurrentlyEditing(null);
    }
  };

  const handleEdit = (key, type, text) => {
    setCurrentlyEditing({ key, type });
    setEditedRuleText(text);
  };

  useEffect(() => {
    const loadRulesets = async () => {
      try {
        const rulesets = await getRulesets(game);
        setStoredRulesets(rulesets || {});
        const activeRulesetTitle = await getActiveRuleset(game);
        if (activeRulesetTitle && rulesets[activeRulesetTitle]) {
          setEditedRuleSet(rulesets[activeRulesetTitle]);
          setCurrentRulesetTitle(activeRulesetTitle);
        } else {
          console.error('Failed to get active ruleset:', activeRulesetTitle);
        }
      } catch (error) {
        console.error('Failed to load rulesets:', error);
      }
    };
    loadRulesets();
  }, [game]);

  const handleLoadSavedRuleset = async (selectedRulesetTitle) => {
    try {
      await setActiveRuleset(game, selectedRulesetTitle);
      const rulesets = await getRulesets(game);
      if (rulesets && rulesets[selectedRulesetTitle]) {
        setEditedRuleSet(rulesets[selectedRulesetTitle]);
        setCurrentRulesetTitle(selectedRulesetTitle);
      } else {
        console.error('Failed to get ruleset:', selectedRulesetTitle);
      }
    } catch (error) {
      console.error('Failed to set active ruleset:', error);
    }
  };

  // Return JSX

  return (
    <div className='p-6 bg-base-100 min-h-screen font-space'>
      {/* Header section */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold text-primary'>
          Edit Rules for {game}
        </h1>
        <div className='flex justify-end'>
          <Link to={`/games/${game}`} className='btn btn-primary mr-4'>
            <MdKeyboardReturn size={32} /> Return to {game}
          </Link>
        </div>
      </div>

      {/* Custom ruleset title input and save button */}
      <div className='mb-4'>
        <input
          type='text'
          className='input input-bordered input-primary w-1/4'
          value={customRulesetTitle}
          onChange={(e) => setCustomRulesetTitle(e.target.value)}
          placeholder='Enter a title for your custom ruleset'
        />
        <button
          className='btn btn-primary ml-1'
          onClick={handleSaveCustomRuleset}
        >
          Save custom ruleset
        </button>

        {/* Ruleset selector */}
        <select
          className='select select-bordered select-primary ml-6'
          value={currentRulesetTitle || ''}
          onChange={(e) => {
            const selectedRulesetTitle = e.target.value;
            handleLoadSavedRuleset(selectedRulesetTitle);
          }}
        >
          <option value='Default'>Default</option>
          {Object.values(storedRulesets).map((ruleset, index) => (
            <option key={index} value={ruleset.title}>
              {ruleset.title}
            </option>
          ))}
        </select>

        {/* View saved rulesets button */}
        <button
          className='btn btn-primary ml-6'
          onClick={() =>
            document.getElementById('saved-rulesets-modal').showModal()
          }
        >
          View saved rulesets
        </button>
      </div>

      {/* Saved rulesets modal */}
      <dialog id='saved-rulesets-modal' className='modal'>
        <div className='modal-box bg-neutral'>
          {/* Modal navbar */}
          <div className='navbar bg-neutral sticky top-0 flex justify-between items-center mb-2'>
            <h3 className='font-bold text-lg text-neutral-content'>
              Saved rulesets for {game}
            </h3>
            <button
              className='btn btn-ghost font-semibold text-lg text-neutral-content'
              onClick={() =>
                document.getElementById('saved-rulesets-modal').close()
              }
            >
              Close
            </button>
          </div>

          {/* Saved rulesets list */}
          <ul>
            {Object.values(storedRulesets).map((ruleset, index) => (
              <li
                className=' flex justify-between items-center px-4 py-2 rounded-lg mb-2 bg-base-100'
                key={index}
              >
                {ruleset.title}
                <button
                  className='btn btn-primary ml-4'
                  onClick={() => handleDeleteRuleset(ruleset.title)}
                >
                  <TiDelete size={28} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </dialog>

      {/* Rules editor */}
      {editedRuleSet &&
        Object.entries(editedRuleSet).map(([key, rule]) => {
          if (!rule) {
            console.error(`Rule with key ${key} is undefined`);
            return null;
          }

          return (
            <div key={key} className='mb-8'>
              <div className='mb-1'>
                <div className='text-xl font-bold mb-2 text-base-content'>
                  {rule.result}
                </div>
                <RuleEdit
                  editing={currentlyEditing}
                  editedText={editedRuleText}
                  setEditedText={setEditedRuleText}
                  handleSubmit={handleSubmit}
                  handleEdit={handleEdit}
                  rule={rule}
                  ruleKey={key}
                  type='title'
                />
              </div>
              <RuleEdit
                editing={currentlyEditing}
                editedText={editedRuleText}
                setEditedText={setEditedRuleText}
                handleSubmit={handleSubmit}
                handleEdit={handleEdit}
                rule={rule}
                ruleKey={key}
                type='description'
              />
            </div>
          );
        })}
    </div>
  );
};

export default EditRulesPage;
