import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import todoApp from './reducers';
import throttle from 'lodash/throttle';
import { loadState, saveState } from './localStorage';

const configureStore = () => {
    const middlewares = [thunk];
    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(createLogger());
    }

    const persistedState = loadState();
    const store= createStore(
        todoApp,
        persistedState,
        applyMiddleware(...middlewares)
    );

    store.subscribe(throttle(() => {
        console.log('state updated, save to local');
        //save state (if needed you can also just save the part of the state you want to be saved locally)
        saveState(store.getState());
    }, 1000));

    return store;
};

export default configureStore;
