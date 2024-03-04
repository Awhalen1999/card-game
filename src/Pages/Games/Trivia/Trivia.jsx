// todo: remove post game alert
// todo: limit # of questions
// todo: add reset game button that returns to setup
// todo: add text to text.js file
// todo: add quick start button that starts game with default settings

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TriviaGameStartForm from './TriviaGameStartForm';

function TriviaGame() {
  const [amount, setAmount] = useState(5);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [type, setType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // handle user's answer
  const handleTriviaAnswer = (answer) => {
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];

    let newScore = score;
    if (answer === currentQuestion.correct_answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Game Over
        alert(`Game Over! Your score: ${newScore}/${questions.length}`);
        // Reset game
        setCurrentQuestionIndex(0);
        setScore(0);
        setGameStarted(false);
      }
    }, 1000);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://opentdb.com/api_category.php');
      setCategories(response.data.trivia_categories);
    } catch (error) {
      console.error('Error fetching trivia categories:', error);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(buildApiUrl());
        setQuestions(response.data.results);
      } catch (error) {
        console.error('Error fetching trivia questions:', error);
      }
    };

    if (gameStarted) {
      // Add a delay before fetching the questions
      setTimeout(fetchQuestions, 1000);
    }
  }, [gameStarted]);

  // Function to build API URL
  const buildApiUrl = () => {
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;

    if (category) {
      apiUrl += `&category=${category}`;
    }

    if (difficulty) {
      apiUrl += `&difficulty=${difficulty}`;
    }

    if (type) {
      apiUrl += `&type=${type}`;
    }

    return apiUrl;
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <TriviaGameStartForm
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        type={type}
        setType={setType}
        categories={categories}
        handleStartGame={handleStartGame}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <div className='bg-base-100 text-base-content h-full flex items-center justify-center'>
        Loading...
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className='p-6 bg-base-100 h-full border'>
      <h1 className='text-2xl font-bold mb-4'>Trivia Game</h1>
      <div className='my-4 flex flex-col items-center justify-center'>
        <p className=' font-bold text-lg text-base-content'>
          Question {currentQuestionIndex + 1} of {amount}
        </p>
        <div className=' divider divider-primary'></div>
        <p
          className='text-lg font-medium text-base-content my-4'
          dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
        />
        <div className='space-x-4 my-6'>
          {currentQuestion.incorrect_answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleTriviaAnswer(answer)}
              className={`px-4 py-2 rounded ${
                selectedAnswer === answer &&
                answer !== currentQuestion.correct_answer
                  ? 'bg-red-600'
                  : 'bg-primary hover:bg-accent'
              } text-white`}
            >
              {answer}
            </button>
          ))}
          <button
            onClick={() => handleTriviaAnswer(currentQuestion.correct_answer)}
            className={`px-4 py-2 rounded ${
              selectedAnswer ? 'bg-green-500' : 'bg-primary hover:bg-accent'
            } text-white`}
          >
            {currentQuestion.correct_answer}
          </button>
        </div>
        <p className='my-6 text-base-content text-lg font-medium'>
          Score: {score}
        </p>
      </div>
      <button
        onClick={() => {
          setCurrentQuestionIndex(0);
          setScore(0);
          setGameStarted(false);
        }}
        className='btn btn-success absolute bottom-0 right-0 m-4'
      >
        Reset Game
      </button>
    </div>
  );
}

export default TriviaGame;
