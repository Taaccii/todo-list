import { createProject } from "./project";

const createProjectManager = ({ initialProjects = []} = {}) => {
  const projects = initialProjects.map(projectData =>
    projectData.addTodo ? projectData : createProject(projectData) 
  );

  let activeProject = projects.length > 0 ? projects[0] : null;

  return {
    
    get projects() { return [...projects]; },
    get activeProject() { return activeProject; },

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