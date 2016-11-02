import {combineReducers} from 'redux';
import * as todos from './todos';
import * as ioState from './iostate';
import todoReducer from './todos';
import ioStateReducer from './iostate';

const todoApp = combineReducers({
    todos: todoReducer,
    ioState: ioStateReducer
});

export default todoApp;

export const getVisibleTodos = (state, filter) =>
    todos.getVisibleTodos(state.todos, filter);

export const getIsFetching = (state, filter) =>
    todos.getIsFetching(state.todos, filter);

export const getTodoById = (state, id) =>
    todos.getTodoById(state.todos, id);

export const getErrorMessage = (state, filter) =>
    todos.getErrorMessage(state.todos, filter);

export const isConnected = (state) =>
    ioState.isConnected(state.ioState);

export const getActionDrafts = (state) =>
    ioState.getActionDrafts(state.ioState);