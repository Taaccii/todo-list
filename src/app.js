import './style.css';
import { storageManager } from "./storageManager";
import { projectManager } from "./projectManager";
import { domController } from './domController';

const initApp = () => {
  const saveData = storageManager.load();

  if (saveData && saveData.projects) {
    projectManager.loadProjects(saveData.projects);
  }

  if (saveData && saveData.activeProjectName) {
    const activeIndex = projectManager.projects.findIndex(
      (p) => p.name === saveData.activeProjectName
    );
    if (activeIndex !== -1) {
      projectManager.setActiveProject(activeIndex);
    }
  }

  domController.init();
};

document.addEventListener('DOMContentLoaded', initApp);