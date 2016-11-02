import todoService from './services';
import * as actions from './actions';
import io from 'socket.io-client';
import { isConnected, getTodoById } from './reducers';

const listenForServiceUpdates = (dispatch, getState) => {
    todoService.on('created', todo => {
        console.log('todo created', todo);
        if(!getTodoById(getState(), todo.id)){
            //add todo from outside to store
            //TODO: still disabled because problems with mechanism: best is to filter out on user id
         //   actions.addExternalTodo(todo)(dispatch);
        }
    });
    todoService.on('updated', todo => {
        console.log('todo updated', todo);
        const oldTodo = getTodoById(getState(), todo.id);
        if(oldTodo && oldTodo.completed != todo.completed){
            //update todo that has been updated outside
            //TODO: still disabled because problems with mechanism: best is to filter out on user id
          //  actions.toggleExternalTodo(todo)(dispatch);
        }
    });

    const socket = io('http://api.todoapp.com');
    socket.on('connect', () => {
        actions.setIOConnected(true)(dispatch);
        actions.processActionDrafts()(dispatch, getState)
    });
    socket.on('connect_error', () => {
        if(isConnected(getState())){
            actions.setIOConnected(false)(dispatch);
        }
    });
};

export default listenForServiceUpdates;