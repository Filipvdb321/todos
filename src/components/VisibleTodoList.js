import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../actions';
import { getVisibleTodos, getErrorMessage, getIsFetching } from '../reducers';
import TodoList from './TodoList';
import FetchError from './FetchError';
import todoService from '../services';

class VisibleTodoList extends Component {
  componentDidMount() {
    this.fetchData();

    //refetch todos when a new todo is created or updated outside the app
    //todo: improvement would be to filter out own added todos
    todoService.on('created', todo => {
      this.fetchData();
    });
    todoService.on('updated', todo => {
      this.fetchData();
    });
  }

  componentDidUpdate(prevProps){
    if(this.props.filter !== prevProps.filter){
      this.fetchData();
    }
  }

  fetchData() {
    const {filter, fetchTodos} = this.props;
    fetchTodos(filter).then(() => console.log('done'));
  }
  render(){
    const {isFetching, errorMessage, toggleTodo, todos} = this.props;
    if(isFetching && !todos.length){
      return <p>Loading...</p>;
    }
    if(errorMessage && !todos.length){
      return(
          <FetchError
            message={errorMessage}
            onRetry={() => this.fetchData() }
          />
      )
    }
    return (
        <TodoList
            todos={todos}
            onTodoClick={toggleTodo}
        />);
  }
}
const mapStateToProps = (state, { params }) => {
  const filter = params.filter || 'all';
  return {
    todos: getVisibleTodos(state, filter || 'all'),
    isFetching: getIsFetching(state, filter),
    errorMessage : getErrorMessage(state, filter),
    filter
  }
};

VisibleTodoList = withRouter(connect(
  mapStateToProps,
  actions
)(VisibleTodoList));

export default VisibleTodoList;
