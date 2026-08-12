import { projectManager } from "./projectManager";
import { storageManager } from "./storageManager";

const createDomController = () => {
  let appContainer;

  const buildBaseLayout = () => {
    appContainer = document.querySelector('#app');
    if (!appContainer) return;

    appContainer.replaceChildren();
  }
}