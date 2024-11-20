const PREFIX = 'fitness_check_'

export const storageService = {
  set: (key: string, value: any) => {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(PREFIX + key, serializedValue)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },

  get: (key: string) => {
    try {
      const serializedValue = localStorage.getItem(PREFIX + key)
      return serializedValue ? JSON.parse(serializedValue) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },

  remove: (key: string) => {
    localStorage.removeItem(PREFIX + key)
  },

  clear: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith(PREFIX))
      .forEach(key => localStorage.removeItem(key))
  },
} 
