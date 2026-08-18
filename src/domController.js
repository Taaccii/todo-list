import { format, parseISO } from 'date-fns';
import { projectManager } from "./projectManager";
import { storageManager } from "./storageManager";
import { createTodoFormModal } from './todoFormModal';
import { createProjectFormModal } from './projectFormModal';

const createThemeToggle = () => {
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'theme-toggle-btn';
  toggleBtn.className = 'theme-toggle-btn';
  toggleBtn.setAttribute('aria-label', 'Change Theme');

  const track = document.createElement('span');
  track.className = 'toggle-track';

  const thumb = document.createElement('span');
  thumb.className = 'toggle-thumb';

  const icon = document.createElement('i');
  thumb.append(icon);
  track.append(thumb);
  toggleBtn.append(track);

  const updateBtnUI = (theme) => {
    if (theme === 'dark') {
      icon.className = 'ph ph-moon';
      toggleBtn.classList.add('active');
    } else {
      icon.className = 'ph ph-sun';
      toggleBtn.classList.remove('active');
    }
  };

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateBtnUI(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme' , newTheme);
    localStorage.setItem('theme', newTheme);
    updateBtnUI(newTheme);
  });

  return toggleBtn;
};

const createDomController = () => {
  let appContainer;
  let layoutContainer;
  const todoModalManager = createTodoFormModal();
  const projectModalManager = createProjectFormModal();

  const toggleMobileView = (showTodos) => {
    if (layoutContainer) {
      layoutContainer.classList.toggle('view-todos', showTodos);
    }
  };

  const buildBaseLayout = () => {
    appContainer = document.querySelector('#app');
    if (!appContainer) return;

    appContainer.replaceChildren();

    layoutContainer = document.createElement('div');
    layoutContainer.classList.add('layout-container');

    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');

    const sidebarHeader = document.createElement('div');
    sidebarHeader.classList.add('sidebar-header');

    const sidebarTitle = document.createElement('h2');
    sidebarTitle.classList.add('sidebar-title');
    sidebarTitle.textContent = 'Projects';

    const btnProjectMobile = document.createElement('button');
    btnProjectMobile.id = 'btn-open-project-dialog-mobile';
    btnProjectMobile.classList.add('btn-add-project-mobile');
    btnProjectMobile.textContent = '+ New Project';

    const themeToggleBtn = createThemeToggle();

    sidebarHeader.append(sidebarTitle, themeToggleBtn, btnProjectMobile);

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
    sidebar.append(sidebarHeader, projectListUl, addProjectForm);
    
    const mainContent = document.createElement('main');
    mainContent.classList.add('main-content');

    const mainHeader = document.createElement('header');
    mainHeader.classList.add('main-header');

    const btnBackMobile = document.createElement('button');
    btnBackMobile.classList.add('btn-back-mobile');
    btnBackMobile.setAttribute('aria-label', 'Back to Projects');

    const backIcon = document.createElement('i');
    backIcon.classList.add('ph', 'ph-caret-left', 'back-icon');

    btnBackMobile.appendChild(backIcon);
    btnBackMobile.addEventListener('click', () => {
      toggleMobileView(false);
    });

    const activeProjectTitle = document.createElement('h1');
    activeProjectTitle.id = 'active-project-title';
    activeProjectTitle.textContent = 'Select project';

    const addTodoBtn = document.createElement('button');
    addTodoBtn.id = 'btn-open-todo-dialog';
    addTodoBtn.classList.add('btn-add-task');
    addTodoBtn.textContent = '+ New Task';

    mainHeader.append(btnBackMobile, activeProjectTitle, addTodoBtn);

    const todoListSection = document.createElement('section');
    todoListSection.id = 'todo-list';
    todoListSection.classList.add('todo-list');

    mainContent.append(mainHeader, todoListSection);
    layoutContainer.append(sidebar, mainContent);
    appContainer.append(
      layoutContainer, 
      todoModalManager.element,
      projectModalManager.element
    );
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
      li.dataset.index = index;

      if (project === projectManager.activeProject) {
        li.classList.add('active');
      }

      const nameSpan = document.createElement('span');
      nameSpan.classList.add('project-name');
      nameSpan.textContent = project.name;

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('btn-delete-project');
      deleteBtn.textContent = 'x';
      deleteBtn.setAttribute('aria-label', `Delete Project ${project.name}`);
      deleteBtn.dataset.action = 'delete';

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

      const cardHeader = document.createElement('div');
      cardHeader.classList.add('todo-card-header');

      const mainInfo = document.createElement('div');
      mainInfo.classList.add('todo-main-info');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('todo-check');
      checkbox.checked = todo.completed;
      checkbox.addEventListener('click', (e) => e.stopPropagation());
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

      const chevronIcon = document.createElement('i');
      chevronIcon.classList.add('ph', 'ph-caret-right', 'chevron-icon');

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
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        activeProject.removeTodo(index);
        updateStateAndRender();
      });

      extraInfo.append(priorityBadge, deleteBtn, chevronIcon);
      cardHeader.append(mainInfo, extraInfo);
      
      const detailSection = document.createElement('div');
      detailSection.classList.add('todo-details');

      if (todo.description) {
        const descP = document.createElement('p');
        descP.classList.add('todo-description-text');
        descP.textContent = todo.description;
        detailSection.appendChild(descP);
      }

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.classList.add('btn-edit-todo');
      editBtn.textContent = 'Edit';

      editBtn.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        todoModalManager.openForEdit(todo, index);
      });

      detailSection.appendChild(editBtn);

      card.addEventListener('click', () => {
        card.classList.toggle('expanded');
      });

      card.append(cardHeader, detailSection);
      todoListEl.appendChild(card);
    });
  };

  const render = () => {
    renderProjects();
    renderTodos();
  };

  const bindEvents = () => {

    const projectListEl = document.querySelector('#project-list');
    if (projectListEl) {
      projectListEl.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'delete') {
          e.stopPropagation();
          const li = e.target.closest('.project-item');
          if (!li) return;
          const index = +li.dataset.index;

          projectManager.removeProject(index);
          updateStateAndRender();
          return;
        }

        const item = e.target.closest('.project-item');
        if (item) {
          const index = +item.dataset.index;
          projectManager.setActiveProject(index);
          toggleMobileView(true);
          updateStateAndRender();
        }
      });
    }

    const addProjectForm = document.querySelector('#add-project-form');
    const newProjectInput = document.querySelector('#new-project-input');

    if (addProjectForm) {
      addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = newProjectInput.value.trim();
        if (name) {
          const newProject = projectManager.addProject(name);
          const newIndex = projectManager.projects.indexOf(newProject);
          projectManager.setActiveProject(newIndex);

          newProjectInput.value = '';
          updateStateAndRender();
        }
      });
    }

    const openProjectMobileBtn = document.querySelector('#btn-open-project-dialog-mobile');

    if (openProjectMobileBtn) {
      openProjectMobileBtn.addEventListener('click', () => {
        projectModalManager.open();
      });
    }

    projectModalManager.onSubmit((projectName) => {
      const newProject = projectManager.addProject(projectName);
      const newIndex = projectManager.projects.indexOf(newProject);

      projectManager.setActiveProject(newIndex);
      toggleMobileView(true);
      updateStateAndRender();
    });

    const openDialogBtn = document.querySelector('#btn-open-todo-dialog');

    if (openDialogBtn) {
      openDialogBtn.addEventListener('click', () => {
        todoModalManager.openForCreate();
      });
    }

    todoModalManager.onSubmit((formData, editingIndex) => {
      const activeProject = projectManager.activeProject;
      if (!activeProject) return;

      if (editingIndex !== null) {
        const todoToEdit = activeProject.getTodo(editingIndex);
        if (todoToEdit) {
          todoToEdit.updateDetails(formData);
        }
      } else {
        activeProject.addTodo(formData);
      }

      updateStateAndRender();
    });
    
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