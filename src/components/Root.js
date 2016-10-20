import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory} from 'react-router';
import Home from './Home';
import TodoApp from './TodoApp';
import About from './About';
import Contact from './Contact';

const Root = ({store}) => (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Home}>
                <Route path="todo" component={TodoApp}/>
                <Route path="todo/(:filter)" component={TodoApp}/>
                <Route path="about" component={About}/>
                <Route path="contact" component={Contact}/>
            </Route>
        </Router>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
