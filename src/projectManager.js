import { createProject } from "./project";

const createProjectManager = ({ initialProjects = []} = {}) => {
  let projects = [];
  let activeProject = null;

  return {
    
    get projects() { return [...projects]; },
    get activeProject() { return activeProject; },

    loadProjects(projectsData) {
      if (!Array.isArray(projectsData)) return;
      projects = projectsData.map(pData => createProject(pData));
      activeProject = projects.length > 0 ? projects[0] : null;
    },

    setActiveProject(index) {
      if (index >= 0 && index < projects.length) {
        activeProject = projects[index]
      }
    },

    addProject(name) {
      const newProject = createProject({ name });
      projects.push(newProject);

      if (projects.length === 1) {
        activeProject = newProject;
      }

      return newProject;
    },

    removeProject(index) {
      if (index >= 0 && index < projects.length) {
        const [removed] = projects.splice(index, 1);

        if (activeProject === removed) {
          activeProject = projects.length > 0 ? projects[0] : null;
        }
      }
    },

    toJSON() {
      return {
        projects: projects.map(p => p.toJSON()),
        activeProjectName: activeProject ? activeProject.name : null
      };
    }
  };
};

export const projectManager = createProjectManager();