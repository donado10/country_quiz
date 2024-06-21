import React, { useEffect, use, Suspense, useState } from "react";
import { QuizCard } from "./QuizCard";
import { QuizCardContext } from "./QuizCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsGameOn, resetGame } from "../Store/app";

import Congrats from "../assets/congrats.svg";

const fetchData = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,capital"
  );
  const data = await response.json();
  return data;
};

function getRandomValueFromArray(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const MainProcess = ({ countries_data }) => {
  const pageChangeHandler = () => {
    const questionParam = new URLSearchParams(document.location.search);
  };

  const navigate = useNavigate();

  return (
    <main className="lg:w-1/2 lg:aspect-[1/0.5] bg-[#343964] rounded-xl sm:w-4/5 sm:aspect-[1/0.8] ">
      {countries_data.length > 0 && (
        <QuizCardContext.Provider value={[...countries_data]}>
          <QuizCard
            content={
              <>
                <QuizCard.Title title={"Country Quiz"} />
                <QuizCard.QuestionsNumbers>
                  <QuizCard.QuestionNumber
                    number={1}
                    onPageChange={pageChangeHandler}
                  />
                  <QuizCard.QuestionNumber
                    number={2}
                    onPageChange={pageChangeHandler}
                  />
                  <QuizCard.QuestionNumber
                    number={3}
                    onPageChange={pageChangeHandler}
                  />
                  <QuizCard.QuestionNumber
                    number={4}
                    onPageChange={pageChangeHandler}
                  />
                  <QuizCard.QuestionNumber
                    number={5}
                    onPageChange={pageChangeHandler}
                  />
                  <QuizCard.QuestionNumber
                    number={6}
                    onPageChange={pageChangeHandler}
                  />
                  <QuizCard.QuestionNumber
                    number={7}
                    onPageChange={pageChangeHandler}
                  />
                  <QuizCard.QuestionNumber
                    number={8}
                    onPageChange={pageChangeHandler}
                  />
                  <QuizCard.QuestionNumber
                    number={9}
                    onPageChange={pageChangeHandler}
                  />
                  <QuizCard.QuestionNumber
                    number={10}
                    onPageChange={pageChangeHandler}
                  />
                </QuizCard.QuestionsNumbers>
                <QuizCard.Question capital={"Dakar"} />
                <QuizCard.Countries />
              </>
            }
          />
        </QuizCardContext.Provider>
      )}
    </main>
  );
};

const initGameData = ([...countries_data]) => {
  const countries_selected = [];
  let countries_set = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 4; j++) {
      const country = getRandomValueFromArray(countries_data);
      countries_set.push(country);
    }
    const response_capital = getRandomValueFromArray(countries_set);

    countries_selected.push({
      information: { question: i + 1, response: response_capital },
      countries_choice: [...countries_set],
    });

    countries_set.length = 0;
  }

  return countries_selected;
};

export const EndGame = ({ score, onClickRestart }) => {
  return (
    <main className="w-1/3 aspect-[1/1] bg-[#343964] rounded-xl flex items-center justify-evenly flex-col ">
      <div className="w-full aspect-[1/0.2] flex items-center justify-center">
        <img src={Congrats} alt="" />
      </div>
      <h1 className="text-4xl text-center text-[#E2E4F3] font-bold">
        Congrats! You completed the quiz.
      </h1>
      <h2 className="text-[#E2E4F3] font-semibold">
        You answer {score}/10 correctly.
      </h2>
      <div
        className="text-center w-1/2 h-16 flex items-center justify-center gap-3 p-3 rounded-xl bg-[#DD524C] hover:cursor-pointer"
        onClick={onClickRestart}
      >
        <h1 className="font-bold text-white">Play Again</h1>
      </div>
    </main>
  );
};

export const Main = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [isGameOn, setIsGameOn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const dispatch = useDispatch();

  const gameStatus = useSelector(
    (state) => state.app.isGameOn,
    (old_value, new_value) => {
      if (!new_value) {
        return false;
      }
      return true;
    }
  );
  const appState = useSelector(
    (state) => state.app,
    (old_value, new_value) => {
      if (new_value.responses.length === 10) {
        return false;
      }

      return true;
    }
  );

  const restartGameOnClick = () => {
    setIsGameOn(true);
    setGameOver(false);
    dispatch(resetGame());
    window.location = "/?question=1";
    /* navigate("/?question=1");
    navigate(0); */
  };

  useEffect(() => {
    console.log("fetching...");
    fetchData().then((data) => {
      setCountriesData(() => initGameData(data));
      setIsGameOn(true);
    });
  }, []);

  useEffect(() => {
    if (!gameStatus) {
      setGameOver(true);
      setIsGameOn(false);
      setGameScore(appState);
    }
    return;
  }, [gameStatus]);

  console.log("heyy__you");
  return (
    <>
      {gameOver && (
        <EndGame score={gameScore.score} onClickRestart={restartGameOnClick} />
      )}
      {isGameOn && <MainProcess countries_data={countriesData} />}
    </>
  );
};
