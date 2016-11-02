import {normalize} from 'normalizr';
import {getIsFetching, getTodoById, isConnected, getActionDrafts} from '../reducers';
import * as api from '../api';
import * as schema from './schema';
import {v4} from 'node-uuid';


//fetchTodos returns a function with dispatch as an argument
//so that it can dispatch multiple times
export const fetchTodos = (filter) => (dispatch, getState) => {
    if (getIsFetching(getState(), filter)) {
        return Promise.resolve();
    }
    dispatch({
        type: 'FETCH_TODOS_REQUEST',
        filter
    });

    return api.fetchTodos(filter).then(
        response => {
            dispatch({
                type: 'FETCH_TODOS_SUCCESS',
                filter,
                response: normalize(response, schema.arrayOfTodos),
            });
        },
        error => {
            dispatch({
                type: 'FETCH_TODOS_FAILURE',
                filter,
                message: error.message || 'Something went wrong.'
            });
        }
    );
};


export const addExternalTodo= (todo) => (dispatch) =>{
    console.log('adding external todo');
    dispatch({
        type: 'ADD_TODO_SUCCESS',
        response: normalize({
            todo
        }, schema.todo),
    });
}

export const addTodo = (text) => (dispatch, getState) =>{
    const addToDoOffline = (error) => {
        if(error){
            console.warn('something went wrong when adding the todo, storing it to be send later:' + error);
        }
        //dispathing add to do success to update store
        dispatch({
            type: 'ADD_TODO_SUCCESS',
            response: normalize({
                id: v4(),
                text: text,
                completed: false
            }, schema.todo),
        });
        //TODO: reducer for add_action_draft, create action method
        addActionDraft({type: 'ADD_TODO',text: text})(dispatch);
    }

    if(isConnected(getState())){
        api.addTodo(text).then(
            response => {
                dispatch({
                    type: 'ADD_TODO_SUCCESS',
                    response: normalize(response, schema.todo),
                });
            }, error => {
                addToDoOffline(error);
            });
    }
    else{
        addToDoOffline();
    }
}

export const toggleExternalTodo= (todo) => (dispatch) =>{
    console.log('toggling external todo:' + todo);
    dispatch({
        type: 'TOGGLE_TODO_SUCCESS',
        response: normalize(todo, schema.todo),
    });
}

export const toggleTodo = (id) => (dispatch, getState) => {
    const toggleTodoOffline = (error) => {
        if(error){
            console.log('something went wrong when toggling the todo, storing it to be send later: ' + error);
        }
        const todoFromStore = getTodoById(getState(), id);
        if (todoFromStore) {
            //copy todo to preserve immutability of store
            var todo = {...todoFromStore};
            todo.completed = !todo.completed;
            dispatch({
                type: 'TOGGLE_TODO_SUCCESS',
                response: normalize(todo, schema.todo),
            });
            addActionDraft({type: 'TOGGLE_TODO',id: id})(dispatch);
        }
        else{
            console.error('toggling todo that doesnt exist anymore');
        }
    }

    if(isConnected(getState())){
        api.toggleTodo(id).then(
            response => {
                dispatch({
                    type: 'TOGGLE_TODO_SUCCESS',
                    response: normalize(response, schema.todo),
                });
            }, error => {
                toggleTodoOffline(error);
            });
    }
    else{
        toggleTodoOffline();
    }
}


export const addActionDraft = (action) => (dispatch) =>
    dispatch({
        type: 'ADD_ACTION_DRAFT',
        actionDraft: action,
    });

export const clearAndRefetch = () => (dispatch, getSate) => {
    dispatch({
        type: 'CLEAR_STORE'
    });
    fetchTodos('all')(dispatch,getSate);
}


export const setIOConnected = (connected) => (dispatch) =>
    dispatch({
        type: 'IO_CONNECTION_CHANGED',
        connected: connected,
    });

export const processActionDrafts = () => (dispatch, getState) => {
    const actionDrafts = getActionDrafts(getState());
    actionDrafts.forEach( action => {
        switch(action.type){
            case 'ADD_TODO':
                return api.addTodo(action.text);
            case 'TOGGLE_TODO':
                return api.toggleTodo(action.id);
            default:
                return;
        }
    });
    //TODO: wait for all promises to be handled!
    clearAndRefetch()(dispatch, getState);
}
