import {combineReducers} from 'redux';

const isConnectedReducer = (state = false, action) => {
    if (action.type === 'IO_CONNECTION_CHANGED') {
        return action.connected;
    }
    return state;
};

const actionDraftsReducuer = (state = [] , action) => {
    if(action.type ==='CLEAR_STORE'){
        return [];
    }
    if (action.type === 'ADD_ACTION_DRAFT') {
        return [...state, action.actionDraft];
    }
    return state;
};

const iostate = combineReducers({
    isConnected : isConnectedReducer,
    actionDrafts : actionDraftsReducuer
});

export default iostate;

export const isConnected = (state) =>
    state.isConnected

export const getActionDrafts = (state) =>
    state.actionDrafts