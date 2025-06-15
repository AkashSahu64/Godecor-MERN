// Mock authentication service
// In a real application, this would make API calls to the backend
const users = [
  {
    id: '1',
    name: 'Akash',
    email: 'akash@example.com',
    password: 'password123',
    role: 'user',
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
];

// Store user data in local storage to persist across refreshes
const saveUserToStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', 'mock-jwt-token');
};

const clearUserFromStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const authService = {
  login: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(
          (u) => u.email === userData.email && u.password === userData.password
        );
        if (user) {
          const { password, ...userWithoutPassword } = user;
          saveUserToStorage(userWithoutPassword);
          resolve(userWithoutPassword);
        } else {
          reject({ message: 'Invalid email or password' });
        }
      }, 1000);
    });
  },
  
  register: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user with email already exists
        const existingUser = users.find((u) => u.email === userData.email);
        if (existingUser) {
          reject({ message: 'User with this email already exists' });
          return;
        }
        
        // Create new user
        const newUser = {
          id: String(users.length + 1),
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: 'user',
        };
        
        users.push(newUser);
        
        const { password, ...userWithoutPassword } = newUser;
        saveUserToStorage(userWithoutPassword);
        resolve(userWithoutPassword);
      }, 1000);
    });
  },
  
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        clearUserFromStorage();
        resolve();
      }, 500);
    });
  },
  
  checkAuth: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (user && token) {
          resolve(JSON.parse(user));
        } else {
          reject();
        }
      }, 500);
    });
  },
  
  adminLogin: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(
          (u) =>
            u.email === userData.email &&
            u.password === userData.password &&
            u.role === 'admin'
        );
        
        if (user) {
          const { password, ...userWithoutPassword } = user;
          saveUserToStorage(userWithoutPassword);
          resolve(userWithoutPassword);
        } else {
          reject({ message: 'Invalid admin credentials' });
        }
      }, 1000);
    });
  },
};

export default authService;