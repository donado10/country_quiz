import React, { createContext, useContext } from "react";
import {
  QuizCardCountries,
  QuizCardQuestionNumber,
  QuizCardQuestionsNumbers,
  QuizCardTitle,
  QuizCardQuestion,
  QuizCardCountry,
} from "./QuizCardElement";

const QuizCardContext = createContext({});

export const useQuizCardContext = () => {
  const context = useContext(QuizCardContext);

  return context;
};

export { QuizCardContext };

export const QuizCard = ({ content }) => {
  return (
    <div className="flex flex-col gap-10 items-center justify-center h-full ">
      {content && content}
    </div>
  );
};

QuizCard.Title = QuizCardTitle;
QuizCard.QuestionNumber = QuizCardQuestionNumber;
QuizCard.QuestionsNumbers = QuizCardQuestionsNumbers;
QuizCard.Question = QuizCardQuestion;
QuizCard.Country = QuizCardCountry;
QuizCard.Countries = QuizCardCountries;
