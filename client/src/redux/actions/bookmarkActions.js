import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import {
  BOOKMARK_ADD_REQ, BOOKMARK_ADD_SUCCESS, BOOKMARK_ADD_FAIL,
  BOOKMARK_REMOVE_REQ, BOOKMARK_REMOVE_SUCCESS, BOOKMARK_REMOVE_FAIL,
  BOOKMARK_GET_REQ, BOOKMARK_GET_SUCCESS, BOOKMARK_GET_FAIL
} from '../constants/Bookmark';


export const addBookmarkAction = (type, data) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BOOKMARK_ADD_REQ
    });

    const userInfo = getState().userLoginReducer.userInfo;
    if (!userInfo || !userInfo.token) {
      throw new Error("User not authenticated");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        'Content-Type': 'application/json'
      }
    };
    const { data: resData } = await axios.post(`${BASE_URL}/api/bookmarks`, { type, data }, config);

    dispatch({
      type: BOOKMARK_ADD_SUCCESS,
      payload: resData
    });
    dispatch({
      type: BOOKMARK_GET_SUCCESS,
      payload: resData
    });
  } catch (error) {
    dispatch({
      type: BOOKMARK_ADD_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};


export const deleteBookmarkAction = (bookmarkId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BOOKMARK_REMOVE_REQ
    });

    const userInfo = getState().userLoginReducer.userInfo;
    if (!userInfo || !userInfo.token) {
      throw new Error("User not authenticated");
    }

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    };
    const { data: resData } = await axios.delete(`${BASE_URL}/api/bookmarks/${bookmarkId}`, config);

    dispatch({
      type: BOOKMARK_REMOVE_SUCCESS,
      payload: resData
    });
    dispatch({
      type: BOOKMARK_GET_SUCCESS,
      payload: resData
    });
  } catch (error) {
    dispatch({
      type: BOOKMARK_REMOVE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};


export const getBookmarksAction = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: BOOKMARK_GET_REQ
    });

    const userInfo = getState().userLoginReducer.userInfo;
    if (!userInfo || !userInfo.token) {
      throw new Error("User not authenticated");
    }

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    };
    const { data: resData } = await axios.get(`${BASE_URL}/api/bookmarks`, config);

    dispatch({
      type: BOOKMARK_GET_SUCCESS,
      payload: resData
    });
  } catch (error) {
    dispatch({
      type: BOOKMARK_GET_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};