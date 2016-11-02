import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../actions';
import { getVisibleTodos, getErrorMessage, getIsFetching} from '../reducers';
import TodoList from './TodoList';
//import FetchError from './FetchError';

class VisibleTodoList extends Component {
  componentDidMount() {
    this.fetchData();
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
    const {isFetching, toggleTodo, todos} = this.props;
    if(isFetching && !todos.length){
      return <p>Loading...</p>;
    }
    /*
    enable if you want to see the errors instead of the local items when the api call failed
    if(errorMessage && !todos.length){
      return(
          <FetchError
            message={errorMessage}
            onRetry={() => this.fetchData() }
          />
      )
    }*/
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
