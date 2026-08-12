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
          return null;
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