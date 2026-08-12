import './style.css';
import { storageManager } from "./storageManager";
import { projectManager } from "./projectManager";

const initApp = () => {
  const saveData = storageManager.load();

  if (saveData && saveData.activeProjectName) {
    const activeIndex = projectManager.projects.findIndex(
      (p) => p.name === saveData.activeProjectName
    );
    if (activeIndex !== -1) {
      projectManager.setActiveProject(activeIndex);
    }
  }

  if (projectManager.projects.length === 0) {
    projectManager.addProject('Default Project');
    storageManager.save(projectManager.toJSON());
  }

};

document.addEventListener('DOMContentLoaded', initApp);