import {
	USER_REGISTRATION_REQ, USER_REGISTRATION_SUCCESS, USER_REGISTRATION_FAIL, USER_REGISTRATION_RESET,
	USER_LOGIN_REQ, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT,
	USER_UPDATE_REQ, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL, USER_UPDATE_RESET,
	USER_REMOVE_REQ, USER_REMOVE_SUCCESS, USER_REMOVE_FAIL, USER_REMOVE_RESET
} from "../constants/UserConstants";


export const userRegisterReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_REGISTRATION_REQ:
			return { loading: true }
		case USER_REGISTRATION_SUCCESS: 
			return { loading: false, userInfo: action.payload, success: true }
		case USER_REGISTRATION_FAIL: 
			return { loading: false, error: action.payload }
		case USER_REGISTRATION_RESET: 
			return {};
		default: return state
	}
}

export const userLoginReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_LOGIN_REQ:
			return { loading: true }
		case USER_LOGIN_SUCCESS: 
			return { loading: false, userInfo: action.payload, success: true }
		case USER_LOGIN_FAIL: 
			return { loading: false, error: action.payload }
		case USER_LOGOUT:
			return {}
		default: return state
	}
}

export const userUpdateReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_UPDATE_REQ:
			return { loading: true }
		case USER_UPDATE_SUCCESS: 
			return { loading: false, success: true }
		case USER_UPDATE_FAIL:
			return { loading: false, error: action.payload }
		case USER_UPDATE_RESET: 
			return {};
		default: return state
	}
}

export const userRemoveReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_REMOVE_REQ:
			return { loading: true };
		case USER_REMOVE_SUCCESS: 
			return { loading: false, success: true };
		case USER_REMOVE_FAIL: 
			return { loading: false, error: action.payload };
		case USER_REMOVE_RESET: 
			return {};
		default: return state;
	}
}