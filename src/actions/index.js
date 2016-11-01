import {normalize} from 'normalizr';
import {getIsFetching, getTodoById} from '../reducers';
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

export const addTodo = (text) => (dispatch, getState) =>
    //TODO: dont call api when offline, extract the error function and execute directly
    api.addTodo(text).then(
        response => {
            dispatch({
                type: 'ADD_TODO_SUCCESS',
                response: normalize(response, schema.todo),
            });
        }, error => {
            console.log('api appeared offline, adding todo locally: ' + error);
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
        });

export const toggleTodo = (id) => (dispatch, getState) =>
    //TODO: dont call api when offline, extract the error function and execute directly
    api.toggleTodo(id).then(
        response => {
            dispatch({
                type: 'TOGGLE_TODO_SUCCESS',
                response: normalize(response, schema.todo),
            });
        }, error => {
            console.log('api appeared offline, toggling todo locally: ' + error);
            var todoFromStore = getTodoById(getState(), id);
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
        });

export const addActionDraft = (action) => (dispatch) =>
    dispatch({
        type: 'ADD_ACTION_DRAFT',
        action: action,
    });