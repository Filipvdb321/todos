import React, {PropTypes} from 'react';
import Header from './Header';
import Footer from './Footer';
import AddTodo from './AddTodo';
import VisibleTodoList from './VisibleTodoList';

const TodoApp = () => (
    <div>
        <Header/>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);

TodoApp.propTypes = {
    params: PropTypes.shape({
        filter: PropTypes.string,
    }),
};

export default TodoApp;
