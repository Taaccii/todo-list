import { format } from "date-fns";

const getDefaultData = () => ({
  activeProjectName: 'Inbox',
  projects: [
    {
      name: 'Inbox',
      todos: [
        {
          title: 'Welcome to your Todo App! 👋',
          description: 'Click on this card to expand details and see options.',
          dueDate: format(new Date(), 'yyyy-MM-dd'),
          priority: 'high',
          completed: false
        },
        {
          title: 'Explore Projects 📁',
          description: 'Create new projects or switch between them from the sidebar.',
          dueDate: '',
          priority: 'medium',
          completed: false
        }
      ]
    },
    {
      name: 'Work / Study',
      todos: [
        {
          title: 'Complete The Odin Project lesson 📚',
          description: 'Finish the Todo List project and push commits to GitHub.',
          dueDate: '',
          priority: 'high',
          completed: false
        }
      ]
    }
  ]
});

const createStorageManager = ({
  key = 'odin_todo_app_data',
  storage = window.localStorage
} = {}) => {

  return {
    /**
     * @param {Object} data
     * @returns {boolean}
     */
    save(data) {
      try {
        const serializedData = JSON.stringify(data);
        storage.setItem(key, serializedData);
        return true;
      } catch (error) {
        console.error('Error saving to storage: ', error);
        return false;
      }
    },

    /**
     * @returns {Object|null}
     */
    load() {
      try {
        const serializedData = storage.getItem(key);

        if (!serializedData) {
          const defaultData = getDefaultData();
          this.save(defaultData);
          return defaultData;
        }
        
        return JSON.parse(serializedData);
      } catch (error) {
        console.error('Error loading from storage: ', error);
        return null;
      }
    },

    /**
     * @returns {boolean}
     */
    clear() {
      try {
        storage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Error clearing storage: ', error);
        return false;
      }
    }
  };
};

export const storageManager = createStorageManager();