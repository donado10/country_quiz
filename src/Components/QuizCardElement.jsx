import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { QuizCard, useQuizCardContext } from "./QuizCard";
import { useSelector, useDispatch } from "react-redux";
import {
  setResponses,
  setScore,
  setIsGameOn,
  getScore,
  setSelectedCountries,
} from "../Store/app";
import CheckRoundFill from "../assets/Check_round_fill.svg";
import CloseRoundFill from "../assets/Close_round_fill.svg";

export const QuizCardTitle = ({ title }) => {
  return <div className="font-bold text-sm text-[#8B8EAB]">{title}</div>;
};

export const QuizCardQuestionNumber = ({ number, onPageChange }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isResponded, setIsResponded] = useState(false);
  const responsesList = useSelector((state) => state.app.responses);
  const location = useLocation();
  const questionParam = +location.search.split("=")[1];

  useEffect(() => {
    if (!isSelected && number === questionParam) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }

    const isQuestionResponded = responsesList.some((response) => {
      return response.question === number;
    });
    /* console.log(isQuestionResponded); */

    if (!isResponded && isQuestionResponded) {
      setIsResponded(true);
    }
  }, [questionParam]);

  const backgroundHandler = () => {
    if (isSelected || isResponded) {
      return "bg-[#DD524C]";
    }

    if (!isSelected && !isResponded) {
      return "bg-[#393F6E]";
    }
  };

  return (
    <li
      className={`${backgroundHandler()} rounded-full w-10 h-10 flex items-center justify-center hover:cursor-pointer`}
      onClick={onPageChange}
    >
      <NavLink
        className=" w-full h-full flex items-center justify-center  text-white text-sm"
        to={`/?question=${number}`}
      >
        {number}
      </NavLink>
    </li>
  );
};

export const QuizCardQuestionsNumbers = ({ children }) => {
  return (
    <ul className="flex gap-2">
      {React.Children.map(children, (child) => {
        return <>{child}</>;
      })}
    </ul>
  );
};

export const QuizCardQuestion = ({ capital }) => {
  const [countries, setCountries] = useState({
    information: { question: null, response: null },
    countries_choice: [],
  });
  const param = new URLSearchParams(document.location.search);
  const context = useQuizCardContext();

  useEffect(() => {
    const new_data = context.find((dict) => {
      const questionNumber = +param.get("question");
      return dict["information"]["question"] === questionNumber;
    });

    if (!new_data) {
      setCountries({
        information: { question: null, response: null },
        countries_choice: [],
      });
      return;
    }

    setCountries(new_data);
  }, [context]);

  return (
    <>
      {countries.countries_choice.length > 0 && (
        <h1 className="font-bold text-2xl text-white">
          Which country is {countries.information.response?.capital} the
          capital?
        </h1>
      )}
    </>
  );
};

export const QuizCardCountry = ({ country, onResponse }) => {
  const responsesList = useSelector((state) => state.app.responses);
  const scoreApp = useSelector((state) => state.app.score);
  const location = useLocation();
  const countryRef = useRef();
  const dispatch = useDispatch();

  const [isCardCorrect, setIsCardCorrect] = useState(0);

  const [oldResponse, setOldResponse] = useState("");

  useEffect(() => {
    setIsCardCorrect(0);
    setOldResponse("");
    const questionPage = +location.search.split("=")[1];
    const getQuestionDetails = responsesList.find((responseCheck) => {
      return questionPage === responseCheck.question;
    });

    if (!getQuestionDetails) {
      return;
    }

    const getCardToCheck = responsesList.find((responseCheck) => {
      return country.name.common === responseCheck.response.name.common;
    });

    const { userResponse, response: questionResponse } = getQuestionDetails;

    if (country.name.common === userResponse.name.common) {
      setOldResponse("bg-[#DD524C]");
    }
    if (getCardToCheck) {
      setIsCardCorrect(1);
      return;
    }

    if (
      userResponse.name.common === country.name.common &&
      userResponse.name.common !== questionResponse.name.common
    ) {
      setIsCardCorrect(-1);
      return;
    }
  }, [country.name.common]);

  useEffect(() => {
    if (responsesList.length === 10) {
      dispatch(setIsGameOn(false));
      return;
    }

    const questionPage = +location.search.split("=")[1];

    const getCardToCheck = responsesList.find((responseCheck) => {
      return country.name.common === responseCheck.response.name.common;
    });

    const getQuestionDetails = responsesList.find((responseCheck) => {
      return questionPage === responseCheck.question;
    });

    if (!getQuestionDetails) {
      return;
    }

    const { userResponse, response: questionResponse } = getQuestionDetails;

    if (getCardToCheck) {
      setIsCardCorrect(1);
      return;
    }
    if (
      userResponse.name.common === country.name.common &&
      userResponse.name.common !== questionResponse.name.common
    ) {
      setIsCardCorrect(-1);
      return;
    }

    setIsCardCorrect(0);
  }, [responsesList]);

  return (
    <div
      className={`text-center w-full h-full flex items-center justify-center gap-3 p-3 rounded-xl ${oldResponse}`}
      onClick={onResponse}
    >
      <h1 ref={countryRef}>{country["name"]["common"]}</h1>
      {isCardCorrect === 1 && <img src={CheckRoundFill} />}
      {isCardCorrect === -1 && <img src={CloseRoundFill} />}
    </div>
  );
};

export const QuizCardCountries = ({}) => {
  const [countries, setCountries] = useState({
    information: { question: null, response: null },
    countries_choice: [],
  });
  const [userResponse, setUserResponse] = useState("");
  const [questionResponse, setQuestionResponse] = useState();
  const [goodResponse, setGoodResponse] = useState();

  const param = new URLSearchParams(document.location.search);
  const context = useQuizCardContext();

  const responsesList = useSelector((state) => state.app.responses);
  const dispatch = useDispatch();

  const isQuestionResponded = (responsesList, question) => {
    return responsesList.some((response) => {
      return response.question === question;
    });
  };

  const clickHandler = (event) => {
    const param = new URLSearchParams(document.location.search);
    const questionNumber = +param.get("question");
    if (isQuestionResponded(responsesList, questionNumber)) {
      return;
    }

    setUserResponse(event.target.textContent);

    const userResponse = countries.countries_choice.find((dict) => {
      return dict["name"]["common"] === event.target.textContent;
    });

    dispatch(
      setResponses({
        question: questionNumber,
        userResponse: { ...userResponse },
        response: countries.information.response,
      })
    );
  };

  useEffect(() => {
    const new_data = context.find((dict) => {
      const questionNumber = +param.get("question");
      return dict["information"]["question"] === questionNumber;
    });

    if (!new_data) {
      setCountries({
        information: { question: null, response: null },
        countries_choice: [],
      });
      dispatch(setSelectedCountries({}));
      return;
    }

    setCountries({ ...new_data });
    dispatch(setSelectedCountries({ ...new_data }));
    setQuestionResponse(new_data["information"]["response"]);
  }, [context]);

  useEffect(() => {
    if (!userResponse) {
      return;
    }
    const country = countries.information.response;

    if (country["name"]["common"] !== userResponse) {
      setGoodResponse(false);

      dispatch(setScore(0));
      return;
    }

    setGoodResponse(true);
    dispatch(setScore(1));
  }, [userResponse]);

  const setResponseColor = (country, userResponse) => {
    if (country["name"]["common"] !== userResponse) {
      return "bg-[#393F6E]";
    }
    if (country["name"]["common"] === userResponse) {
      return "bg-[#DD524C]";
    }
  };

  return (
    <ul className="grid grid-cols-2 grid-rows-2 w-3/5 place-items-center gap-5">
      {countries?.countries_choice.length > 0 &&
        countries.countries_choice.map((country, i) => {
          return (
            <li
              key={i}
              className={`hover:cursor-pointer w-full h-full flex items-center justify-center ${setResponseColor(
                country,
                userResponse,
                questionResponse,
                goodResponse
              )} rounded-xl text-white font-semibold`}
            >
              <QuizCardCountry
                country={{ ...country }}
                onResponse={clickHandler}
              />
            </li>
          );
        })}
    </ul>
  );
};
