import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import {
	USER_REGISTRATION_REQ, USER_REGISTRATION_SUCCESS, USER_REGISTRATION_FAIL,
	USER_LOGIN_REQ, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT,
	USER_UPDATE_REQ, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL,
	USER_REMOVE_REQ, USER_REMOVE_SUCCESS, USER_REMOVE_FAIL
} from "../constants/UserConstants";


export const userRegisterAction = (name, email, password, avatar) => async (dispatch) => {
	try {
		dispatch({ 
			type: USER_REGISTRATION_REQ 
		});
		const formData = new FormData();
		formData.append("name", name);
		formData.append("email", email);
		formData.append("password", password);
		if (avatar) { 
			formData.append("avatar", avatar); 
		}
		const [data] = await Promise.all([
			axios.post(`${BASE_URL}/api/user/registration`, formData).then(res => res.data),
			new Promise((resolve) => setTimeout(resolve, 1500))
		]);
		dispatch({ 
			type: USER_REGISTRATION_SUCCESS,
			payload: data
		});
	} catch (error) { 
		setTimeout(() => {
			dispatch({ 
				type: USER_REGISTRATION_FAIL,
				payload: error.response && error.response.data.message ? error.response.data.message : error.message
			});
		}, 1500);
	}
}

export const userLoginAction = (email, password) => async (dispatch) => {
	try {
		dispatch({ 
			type: USER_LOGIN_REQ 
		});
		const config = { 
			headers: { "Content-Type": "application/json" } 
		}
		const [data] = await Promise.all([
			axios.post(`${BASE_URL}/api/user/login`, { email, password }, config).then(res => res.data), 
			new Promise((resolve) => setTimeout(resolve, 1500))
		]);
		dispatch({ 
			type: USER_LOGIN_SUCCESS,
			payload: data
		});
		localStorage.setItem("userInfo", JSON.stringify(data)); 
	} catch (error) {
		setTimeout(() => {
		dispatch({ 
			type: USER_LOGIN_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message
		});
	}, 1500);
	}
}

export const userLogoutAction = () => async (dispatch) => {
	localStorage.removeItem("userInfo"); 
	dispatch({ 
		type: USER_LOGOUT
	});
	document.location.href = "/";
}

export const userUpdateAction = (updatedUser) => async (dispatch, getState) => {
	try {
		dispatch({ 
			type: USER_UPDATE_REQ 
		});
		const userInfo = getState().userLoginReducer.userInfo; 
		if (!userInfo || !userInfo.token) { 
			throw new Error("User not authenticated");
		}
		const config = { 
			headers: {
				Authorization: `Bearer ${userInfo.token}`, 
				"Content-Type": "multipart/form-data"
			}
		};
		const [data] = await Promise.all([
			axios.put(`${BASE_URL}/api/user/profile`, updatedUser, config).then(res => res.data),  
			new Promise((resolve) => setTimeout(resolve, 1500))
		]);
		dispatch({ 
			type: USER_UPDATE_SUCCESS,
			payload: data
		});
		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data
		});
		localStorage.setItem("userInfo", JSON.stringify(data)); 
	} catch (error) {
		setTimeout(() => {
			dispatch({ 
				type: USER_UPDATE_FAIL,
				payload: error.response && error.response.data.message ? error.response.data.message : error.message
			});
		}, 1500);
	}
}

export const userRemoveAction = () => async (dispatch, getState) => {
	try {
		dispatch({ 
			type: USER_REMOVE_REQ 
		});
		const userInfo = getState().userLoginReducer.userInfo; 
		if (!userInfo || !userInfo.token) { 
			throw new Error("User not authenticated");
		}
		const config = {
			headers: { Authorization: `Bearer ${userInfo.token}` } 
		};
		await axios.delete(`${BASE_URL}/api/user/profile`, config); 
		dispatch({ 
			type: USER_REMOVE_SUCCESS
		});
		localStorage.removeItem("userInfo");
	} catch (error) {
		dispatch({
			type: USER_REMOVE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message
		});
	}
}