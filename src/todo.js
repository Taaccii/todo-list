export const createTodo = ({ title, description, dueDate, priority = 'low', notes = '', completed = false }) => {
  const details = { title, description, dueDate, priority, notes };
  let isCompleted = completed;

  return {
    get title() { return title; },
    get description() { return description; },
    get dueDate() { return dueDate; },
    get priority() { return priority; },
    get notes() { return notes; },
    get completed() { return isCompleted; },

    toggleComplete() {
      isCompleted = !isCompleted;
    },
    updateDetails(newDetails) {
      Object.assign(details, newDetails);
    },
    toJSON() {
      return {
        ...details,
        completed: isCompleted,
      };
    }
  };
};