import todoService from './services';

const listenForServiceUpdates = (dispatch) => {
        todoService.on('created', todo => {
            console.log('todo created', todo);
        });
    };

export default listenForServiceUpdates;