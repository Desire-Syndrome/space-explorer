import {
	GET_NASA_EPIC_REQ, GET_NASA_EPIC_SUCCESS, GET_NASA_EPIC_FAIL, NASA_EPIC_RESET,
  GET_NASA_APOD_REQ, GET_NASA_APOD_SUCCESS, GET_NASA_APOD_FAIL, NASA_APOD_RESET,
  GET_NASA_ROVERS_REQ, GET_NASA_ROVERS_SUCCESS, GET_NASA_ROVERS_FAIL, NASA_ROVERS_RESET
} from "../constants/NasaConstants.js";


const initEpicReducerState = { data: [], loading: false, error: null };

export const nasaEpicReducer = (state = initEpicReducerState, action) => {
  switch (action.type) {
    case GET_NASA_EPIC_REQ:
      return { ...state, loading: true };
    case GET_NASA_EPIC_SUCCESS:
      return { loading: false, data: action.payload, error: null };
    case GET_NASA_EPIC_FAIL:
      return { loading: false, data: [], error: action.payload };
    case NASA_EPIC_RESET:
      return { ...initEpicReducerState };
    default:
      return state;
  }
};


const initApodReducerState = { data: null, loading: false, error: null };

export const nasaApodReducer = (state = initApodReducerState, action) => {
  switch (action.type) {
    case GET_NASA_APOD_REQ:
      return { ...state, loading: true };
    case GET_NASA_APOD_SUCCESS:
      return { loading: false, data: action.payload, error: null };
    case GET_NASA_APOD_FAIL:
      return { loading: false, data: null, error: action.payload };
    case NASA_APOD_RESET:
      return { ...initApodReducerState };
    default:
      return state;
  }
};


const initRoversReducerState = { data: [], loading: false, error: null };

export const nasaRoversReducer = (state = initRoversReducerState, action) => {
  switch (action.type) {
    case GET_NASA_ROVERS_REQ:
      return { ...state, loading: true };
    case GET_NASA_ROVERS_SUCCESS:
      return { loading: false, data: action.payload, error: null };
    case GET_NASA_ROVERS_FAIL:
      return { loading: false, data: [], error: action.payload };
    case NASA_ROVERS_RESET:
      return { ...initRoversReducerState };
    default:
      return state;
  }
};