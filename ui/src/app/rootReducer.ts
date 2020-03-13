import {combineReducers} from '@reduxjs/toolkit';
import realmsListReducer from './realmsList/realmsListSlice';
import toastsReducer from './toasts/toastsSlice';
import usersListReducer from './usersList/usersListSlice';
import groupsListReducer from './groupsList/groupsListSlice';
import groupUsersReducer from './groupUsers/groupUsersSlice';
import rolesListReducer from './rolesList/rolesListSlice';
import roleUsersReducer from './roleUsers/roleUsersSlice';
import roleGroupsReducer from './roleGroups/roleGroupsSlice';
const rootReducer = combineReducers({
    realmsList: realmsListReducer,
    groupsList: groupsListReducer,
    rolesList: rolesListReducer,
    usersList: usersListReducer,
    groupUsers: groupUsersReducer,
    roleUsers: roleUsersReducer,
    roleGroups: roleGroupsReducer,
    toasts: toastsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
