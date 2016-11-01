import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import hooks from 'feathers-hooks';
import io from 'socket.io-client';

// Establish a Socket.io connection
const socket = io('http://api.todoapp.com:8080');
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const feathersApp = feathers()
    .configure(socketio(socket))
    .configure(hooks());


const todoService = feathersApp.service('todos');

export default todoService

