import { createTodo } from "./todo";

export const createProject = ({ name, todos = [] }) => {
  const todoList = todos.map(todoData => 
    todoData.toggleComplete ? todoData : createTodo(todoData)
  );

  return {
    get name() { return name; },
    get todos() { return [...todoList]; },

    setName(newName) {
      name = newName;
    },
    
    addTodo(todoData) {
      const newTodo = todoData.toggleComplete ? todoData : createTodo(todoData);
      todoList.push(newTodo);
      return newTodo;
    },

    removeTodo(index) {
      if (index >= 0 && index < todoList.length) {
        todoList.splice(index, 1);
      }
    },

    getTodo(index) {
      return todoList[index];
    },

    toJSON() {
      return {
        name : name,
        todos : todoList.map(todo => todo.toJSON()),
      };
    }
  };
};