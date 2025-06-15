// Mock users data
let users = [
  {
    id: '1',
    name: 'Akash',
    email: 'akash@example.com',
    role: 'user',
    isBlocked: false,
    createdAt: '2023-01-15T10:30:00.000Z',
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    isBlocked: false,
    createdAt: '2023-01-10T08:15:00.000Z',
  },
  {
    id: '3',
    name: 'Akash Sahu',
    email: 'sahu@example.com',
    role: 'user',
    isBlocked: false,
    createdAt: '2023-02-20T14:45:00.000Z',
  },
];

const userService = {
  getUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter out sensitive information
        const safeUsers = users.map(({ password, ...user }) => user);
        resolve(safeUsers);
      }, 1000);
    });
  },
  
  updateUserStatus: async (userId, isBlocked) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = users.findIndex((user) => user.id === userId);
        
        if (userIndex !== -1) {
          users[userIndex].isBlocked = isBlocked;
          const { password, ...userWithoutPassword } = users[userIndex];
          resolve(userWithoutPassword);
        } else {
          reject({ message: 'User not found' });
        }
      }, 1000);
    });
  },
};

export default userService;