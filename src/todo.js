export const createTodo = ({ title, description, dueDate, priority = 'low', notes = '', completed = false }) => {
  const details = { title, description, dueDate, priority, notes };
  let isCompleted = completed;

  return {
    get title() { return details.title; },
    get description() { return details.description; },
    get dueDate() { return details.dueDate; },
    get priority() { return details.priority; },
    get notes() { return details.notes; },
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