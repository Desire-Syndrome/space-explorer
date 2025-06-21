import {
	BOOKMARK_ADD_REQ, BOOKMARK_ADD_SUCCESS, BOOKMARK_ADD_FAIL, BOOKMARK_ADD_RESET,
	BOOKMARK_REMOVE_REQ, BOOKMARK_REMOVE_SUCCESS, BOOKMARK_REMOVE_FAIL, BOOKMARK_REMOVE_RESET,
	BOOKMARK_GET_REQ, BOOKMARK_GET_SUCCESS, BOOKMARK_GET_FAIL, BOOKMARK_GET_RESET
} from "../constants/Bookmark";


export const bookmarkAddReducer = (state = {}, action) => {
	switch (action.type) {
		case BOOKMARK_ADD_REQ:
			return { loading: true }
		case BOOKMARK_ADD_SUCCESS: 
			return { loading: false, success: true }
		case BOOKMARK_ADD_FAIL: 
			return { loading: false, error: action.payload }
		case BOOKMARK_ADD_RESET: 
			return {};
		default: return state
	}
}
 

export const bookmarkRemoveReducer = (state = {}, action) => {
	switch (action.type) {
		case BOOKMARK_REMOVE_REQ:
			return { loading: true }
		case BOOKMARK_REMOVE_SUCCESS: 
			return { loading: false, success: true }
		case BOOKMARK_REMOVE_FAIL: 
			return { loading: false, error: action.payload }
		case BOOKMARK_REMOVE_RESET: 
			return {};
		default: return state
	}
}


export const bookmarksGetReducer = (state = {}, action) => {
	switch (action.type) {
		case BOOKMARK_GET_REQ:
			return { loading: true }
		case BOOKMARK_GET_SUCCESS: 
			return { loading: false, bookmarks: action.payload.bookmarks, success: true }
		case BOOKMARK_GET_FAIL: 
			return { loading: false, error: action.payload }
		case BOOKMARK_GET_RESET: 
			return {};
		default: return state
	}
}