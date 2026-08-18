export const createProjectFormModal = () => {
  const dialog = document.createElement('dialog');
  dialog.classList.add('todo-dialog');

  const form = document.createElement('form');
  form.method = 'dialog';

  const heading = document.createElement('h3');
  heading.textContent = 'New Project';
  heading.style.marginBottom = '1rem';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Project name...';
  input.required = true;

  const actions = document.createElement('div');
  actions.classList.add('dialog-actions');

  const btnCancel = document.createElement('button');
  btnCancel.type = 'button';
  btnCancel.classList.add('btn-secondary');
  btnCancel.textContent = 'Cancel';

  const btnSubmit = document.createElement('button');
  btnSubmit.type = 'submit';
  btnSubmit.classList.add('btn-primary');
  btnSubmit.textContent = 'Create';

  actions.append(btnCancel, btnSubmit);
  form.append(heading, input, actions);
  dialog.appendChild(form);

  let submitCallback = null;

  btnCancel.addEventListener('click', () => {
    dialog.close();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (name && submitCallback) {
      submitCallback(name);
      dialog.close();
    }
  });

  return {
    element: dialog,
    open() {
      input.value = '';
      dialog.showModal();
    },
    onSubmit(callback) {
      submitCallback = callback;
    }
  };
};