import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  responses: [],
  score: 0,
  seleted_countries_page: [],
  isGameOn: 1,
};

const appSlice = createSlice({
  name: "app",
  initialState: { ...initialState },
  reducers: {
    resetGame: (state) => {
      state.responses.length = 0;
      state.score = 0;
      state.seleted_countries_page.length = 0;
    },
    setResponses: (state, action) => {
      state.responses.push(action.payload);
    },
    setScore: (state, action) => {
      state.score += action.payload;
    },
    setIsGameOn: (state, action) => {
      state.isGameOn = action.payload;
    },

    setSelectedCountries: (state, action) => {
      state.seleted_countries_page = [...action.payload.countries_choice];
    },

    getScore: (state) => {
      return state.score;
    },
  },
});

export default appSlice;

export const {
  setResponses,
  setScore,
  getScore,
  setIsGameOn,
  setSelectedCountries,
  resetGame,
} = appSlice.actions;
