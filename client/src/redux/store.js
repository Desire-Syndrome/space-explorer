import { combineReducers, createStore, applyMiddleware } from "redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { thunk } from "redux-thunk";

const persistConfig = {
	key: 'root',
	storage
}


import {
	userRegisterReducer, userLoginReducer, userUpdateReducer, userRemoveReducer
} from "./reducers/UserReducer";
import {
	nasaEpicReducer, nasaApodReducer, nasaRoversReducer
} from "./reducers/NasaReducer";
import {
	bookmarkAddReducer, bookmarkRemoveReducer, bookmarksGetReducer
} from "./reducers/BookmarkReducer";

const rootReducer = combineReducers({
	userRegisterReducer, userLoginReducer, userUpdateReducer, userRemoveReducer,
	nasaEpicReducer, nasaApodReducer, nasaRoversReducer,
	bookmarkAddReducer, bookmarkRemoveReducer, bookmarksGetReducer
});


const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleware = [thunk];
export const store = createStore(persistedReducer, applyMiddleware(...middleware));

export let persistor = persistStore(store);