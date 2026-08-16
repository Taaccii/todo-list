export const createTodoFormModal = () => {
  const todoDialog = document.createElement('dialog');
  todoDialog.id = 'todo-dialog';
  todoDialog.classList.add('todo-dialog');

  const todoForm = document.createElement('form');
  todoForm.id = 'todo-form';
  todoForm.setAttribute('method', 'dialog');

  const dialogTitle = document.createElement('h2');
  dialogTitle.textContent = 'Add New Task';

  const titleLabel = document.createElement('label');
  titleLabel.setAttribute('for', 'todo-title');
  titleLabel.textContent = 'Title *';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.id = 'todo-title';
  titleInput.required = true;
  titleInput.placeholder = 'e.g. Finish Odin Project';

  const descLabel = document.createElement('label');
  descLabel.setAttribute('for', 'todo-description');
  descLabel.textContent = 'Description';

  const descTextArea = document.createElement('textarea');
  descTextArea.id = 'todo-description';
  descTextArea.rows = 3;
  descTextArea.placeholder = 'Additional details...';

  const formRow = document.createElement('div');
  formRow.classList.add('form-row');

  const dateGroup = document.createElement('div');
  const dateLabel = document.createElement('label');
  dateLabel.setAttribute('for', 'todo-due-date');
  dateLabel.textContent = 'Due Date';

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.id = 'todo-due-date';

  dateGroup.append(dateLabel, dateInput);

  const priorityGroup = document.createElement('div');
  const priorityLabel = document.createElement('label');
  priorityLabel.setAttribute('for', 'todo-priority');
  priorityLabel.textContent = 'Priority';

  const prioritySelect = document.createElement('select');
  prioritySelect.id = 'todo-priority';

  const optLow = document.createElement('option');
  optLow.value = 'low';
  optLow.textContent = 'Low';

  const optMedium = document.createElement('option');
  optMedium.value = 'medium';
  optMedium.textContent = 'Medium';

  const optHigh = document.createElement('option');
  optHigh.value = 'high';
  optHigh.textContent = 'High';

  prioritySelect.append(optLow, optMedium, optHigh);
  priorityGroup.append(priorityLabel, prioritySelect);

  formRow.append(dateGroup, priorityGroup);

  const dialogActions = document.createElement('div');
  dialogActions.classList.add('dialog-actions');

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.id = 'btn-cancel-todo';
  cancelBtn.classList.add('btn-secondary');
  cancelBtn.textContent = 'Cancel';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'submit';
  saveBtn.classList.add('btn-primary');
  saveBtn.textContent = 'Save Task';

  dialogActions.append(cancelBtn, saveBtn);

  todoForm.append(
    dialogTitle,
    titleLabel,
    titleInput,
    descLabel,
    descTextArea,
    formRow,
    dialogActions
  );

  todoDialog.appendChild(todoForm);

  return todoDialog;
};
