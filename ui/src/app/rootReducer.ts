import {combineReducers} from '@reduxjs/toolkit';
import realmsListReducer from './realmsList/realmsListSlice';
import toastsReducer from './toasts/toastsSlice';
import usersListReducer from './usersList/usersListSlice';
import groupsListReducer from './groupsList/groupsListSlice';
const rootReducer = combineReducers({
    realmsList: realmsListReducer,
    groupsList: groupsListReducer,
    usersList: usersListReducer,
    toasts: toastsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
