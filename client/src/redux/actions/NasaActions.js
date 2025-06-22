import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import {
  GET_NASA_EPIC_REQ, GET_NASA_EPIC_SUCCESS, GET_NASA_EPIC_FAIL,
  GET_NASA_APOD_REQ, GET_NASA_APOD_SUCCESS, GET_NASA_APOD_FAIL,
  
  GET_NASA_ROVERS_REQ, GET_NASA_ROVERS_SUCCESS, GET_NASA_ROVERS_FAIL
} from "../constants/NasaConstants";


export const nasaEpicAction = (date = "") => async (dispatch) => {
  try {
    dispatch({
      type: GET_NASA_EPIC_REQ
    });

    let url = `${BASE_URL}/api/nasa/epic`;
    if (date) { url += `?date=${date}`; }

    const [data] = await Promise.all([
      axios.get(url).then(res => res.data),
      new Promise((resolve) => setTimeout(resolve, 1500))
    ]);

    dispatch({
      type: GET_NASA_EPIC_SUCCESS,
      payload: data
    });
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: GET_NASA_EPIC_FAIL,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message
      });
    }, 1500);
  }
};


export const nasaApodAction = (daysAgo = 0) => async (dispatch) => {
  try {
    dispatch({
      type: GET_NASA_APOD_REQ
    });

    let url = `${BASE_URL}/api/nasa/apod`;
    if (daysAgo) { url += `?daysAgo=${daysAgo}`; }

    const [data] = await Promise.all([
      axios.get(url).then(res => res.data),
      new Promise((resolve) => setTimeout(resolve, 1500))
    ]);

    dispatch({
      type: GET_NASA_APOD_SUCCESS,
      payload: data
    });
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: GET_NASA_APOD_FAIL,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message
      });
    }, 1500);
  }
};


export const nasaRoversAction = (sol) => async (dispatch) => {
  try {
    dispatch({
      type: GET_NASA_ROVERS_REQ
    });

    let url = `${BASE_URL}/api/nasa/rovers`;
    if (sol !== undefined && sol !== null) { url += `?sol=${sol}`; }

    const [data] = await Promise.all([
      axios.get(url).then(res => res.data),
      new Promise((resolve) => setTimeout(resolve, 1500))
    ]);

    dispatch({
      type: GET_NASA_ROVERS_SUCCESS,
      payload: data
    });
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: GET_NASA_ROVERS_FAIL,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message
      });
    }, 1500);
  }
};
