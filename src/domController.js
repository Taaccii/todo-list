import { format, parseISO } from 'date-fns';
import { projectManager } from "./projectManager";
import { storageManager } from "./storageManager";
import { createTodoFormModal } from './todoFormModal';

const createDomController = () => {
  let appContainer;

  const buildBaseLayout = () => {
    appContainer = document.querySelector('#app');
    if (!appContainer) return;

    appContainer.replaceChildren();

    const layoutContainer = document.createElement('div');
    layoutContainer.classList.add('layout-container');

    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');

    const sidebarTitle = document.createElement('h2');
    sidebarTitle.classList.add('sidebar-title');
    sidebarTitle.textContent = 'Projects';

    const projectListUl = document.createElement('ul');
    projectListUl.id = 'project-list';
    projectListUl.classList.add('project-list');

    const addProjectForm = document.createElement('form');
    addProjectForm.id = 'add-project-form';
    addProjectForm.classList.add('inline-form');

    const newProjectInput = document.createElement('input');
    newProjectInput.type = 'text';
    newProjectInput.id = 'new-project-input';
    newProjectInput.placeholder = '+ New Project';
    newProjectInput.required = true;

    const addProjectBtn = document.createElement('button');
    addProjectBtn.type = 'submit';
    addProjectBtn.classList.add('btn-add');
    addProjectBtn.textContent = 'Add';

    addProjectForm.append(newProjectInput, addProjectBtn);
    sidebar.append(sidebarTitle, projectListUl, addProjectForm);
    
    const mainContent = document.createElement('main');
    mainContent.classList.add('main-content');

    const mainHeader = document.createElement('header');
    mainHeader.classList.add('main-header');

    const activeProjectTitle = document.createElement('h1');
    activeProjectTitle.id = 'active-project-title';
    activeProjectTitle.textContent = 'Select project';

    const addTodoBtn = document.createElement('button');
    addTodoBtn.id = 'btn-open-todo-dialog';
    addTodoBtn.classList.add('btn-add-task');
    addTodoBtn.textContent = '+ New Task';

    mainHeader.append(activeProjectTitle, addTodoBtn);

    const todoListSection = document.createElement('section');
    todoListSection.id = 'todo-list';
    todoListSection.classList.add('todo-list');
    
    const todoDialog = createTodoFormModal();

    mainContent.append(mainHeader, todoListSection);
    layoutContainer.append(sidebar, mainContent);
    appContainer.append(layoutContainer, todoDialog);

  };

  const updateStateAndRender = () => {
    storageManager.save(projectManager.toJSON());
    render();
  };


  const renderProjects = () => {
    const projectListEl = document.querySelector('#project-list');
    if (!projectListEl) return;

    projectListEl.replaceChildren();

    projectManager.projects.forEach((project, index) => {
      const li = document.createElement('li');
      li.classList.add('project-item');

      if (project === projectManager.activeProject) {
        li.classList.add('active');
      }

      const nameSpan = document.createElement('span');
      nameSpan.classList.add('project-name');
      nameSpan.textContent = project.name;
      nameSpan.addEventListener('click', () => {
        projectManager.setActiveProject(index);
        updateStateAndRender();
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('btn-delete-project');
      deleteBtn.textContent = 'x';
      deleteBtn.setAttribute('aria-label', 'Delete Project');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        projectManager.removeProject(index);
        updateStateAndRender();
      });

      li.append(nameSpan, deleteBtn);
      projectListEl.appendChild(li);
    });
  };

  const renderTodos = () => {
    const todoListEl = document.querySelector('#todo-list');
    const titleEl = document.querySelector('#active-project-title');
    const activeProject = projectManager.activeProject;

    if(!todoListEl || !titleEl) return;

    todoListEl.replaceChildren();

    if(!activeProject) {
      titleEl.textContent = 'No projects selected';
      const emptyMsg = document.createElement('p');
      emptyMsg.classList.add('empty-msg');
      emptyMsg.textContent = 'Create or select a project to get started.';
      todoListEl.appendChild(emptyMsg);
      return;
    }

    titleEl.textContent = activeProject.name;

    if(activeProject.todos.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.classList.add('empty-msg');
      emptyMsg.textContent = 'No tasks in this project.';
      todoListEl.appendChild(emptyMsg);
      return;
    }

    activeProject.todos.forEach((todo, index) => {
      const card = document.createElement('div');
      const priority = todo.priority || 'medium';
      card.classList.add('todo-card', `priority-${priority}`);
      if (todo.completed) {
        card.classList.add('completed');
      }

      const mainInfo = document.createElement('div');
      mainInfo.classList.add('todo-main-info');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('todo-check');
      checkbox.checked = todo.completed;
      checkbox.addEventListener('change', () => {
        todo.toggleComplete();
        updateStateAndRender();
      });

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('todo-title');
      titleSpan.textContent = todo.title;

      mainInfo.append(checkbox, titleSpan);

      const extraInfo = document.createElement('div');
      extraInfo.classList.add('todo-extra-info');

      if (todo.dueDate) {
        const dateSpan = document.createElement('span');
        dateSpan.classList.add('todo-date');

        const parsedDate = parseISO(todo.dueDate);
        dateSpan.textContent = format(parsedDate, 'dd MMM yyyy');
        extraInfo.appendChild(dateSpan);
      }

      const priorityBadge = document.createElement('span');
      priorityBadge.classList.add('priority-badge', `badge-${priority}`);
      priorityBadge.textContent = priority.toUpperCase();

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('btn-delete-todo');
      deleteBtn.textContent = 'x';
      deleteBtn.setAttribute('aria-label', 'Delete Task');
      deleteBtn.addEventListener('click', () => {
        activeProject.removeTodo(index);
        updateStateAndRender();
      });

      extraInfo.append(priorityBadge, deleteBtn);
      card.append(mainInfo, extraInfo);
      todoListEl.appendChild(card);
    });
  };

  const render = () => {
    renderProjects();
    renderTodos();
  };

  const bindEvents = () => {
    const addProjectForm = document.querySelector('#add-project-form');
    const newProjectInput = document.querySelector('#new-project-input');

    if (addProjectForm) {
      addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = newProjectInput.value.trim();
        if (name) {
          projectManager.addProject(name);
          newProjectInput.value = '';
          updateStateAndRender();
        }
      });
    }

    const todoDialog = document.querySelector('#todo-dialog');
    const openDialogBtn = document.querySelector('#btn-open-todo-dialog');
    const cancelDialogBtn = document.querySelector('#btn-cancel-todo');
    const todoForm = document.querySelector('#todo-form');

    if (openDialogBtn && todoDialog) {
      openDialogBtn.addEventListener('click', () => {
        todoForm.reset()
        todoDialog.showModal();
      });
    }

    if (cancelDialogBtn && todoDialog) {
      cancelDialogBtn.addEventListener('click', () => {
        todoDialog.close();
      });
    }

    if (todoForm) {
      todoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const activeProject = projectManager.activeProject;
        if (!activeProject) return;

        const title = document.querySelector('#todo-title').value.trim();
        const description = document.querySelector('#todo-description').value.trim();
        const dueDate = document.querySelector('#todo-due-date').value;
        const priority = document.querySelector('#todo-priority').value;

        if (title) {
          activeProject.addTodo(title, description, dueDate, priority);
          updateStateAndRender();
          todoDialog.close();
        }
      });
    }
  };

  return {
    init() {
      buildBaseLayout();
      bindEvents();
      render();
    },
    render
  };
};

export const domController = createDomController();