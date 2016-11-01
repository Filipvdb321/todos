import todoService from '../services';

export const fetchTodos = (filter) => {
    const params = { query : {}};
    if(filter !== 'all'){
        params.query.completed = filter === 'completed';
    }
    return todoService.find(params).then((res) => {
        return res;
    });
};


export const addTodo = (text) =>
    todoService.create({text});

export const toggleTodo = (id) => {
    return todoService.get(id).then( (todo) => {
       if(todo){
           todo.completed = !todo.completed;
           todoService.update(id, todo);
           return todo;
       }
    });
};