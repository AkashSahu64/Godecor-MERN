// Mock orders data
let orders = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Akash',
    },
    items: [
      {
        id: '1',
        name: 'Japanese Bonsai',
        price: 3999,
        quantity: 1,
        imageUrl: 'https://images.pexels.com/photos/4751969/pexels-photo-4751969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
    ],
    shippingAddress: {
      name: 'Akash',
      phone: '123-456-7890',
      address: '123 Main St, City, Country',
    },
    paymentMethod: 'razorpay',
    paymentId: 'pay_123456',
    totalAmount: 3999,
    status: 'pending',
    createdAt: '2023-05-15T10:30:00.000Z',
  },
  {
    id: '2',
    user: {
      id: '1',
      name: 'Akash',
    },
    items: [
      {
        id: '2',
        name: 'Monstera Deliciosa',
        price: 3199,
        quantity: 2,
        imageUrl: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
    ],
    shippingAddress: {
      name: 'Akash',
      phone: '123-456-7890',
      address: '123 Main St, City, Country',
    },
    paymentMethod: 'razorpay',
    paymentId: 'pay_789012',
    totalAmount: 6398,
    status: 'shipped',
    createdAt: '2023-04-20T14:45:00.000Z',
  },
];

const orderService = {
  createOrder: async (orderData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder = {
          id: String(orders.length + 1),
          ...orderData,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        
        orders.push(newOrder);
        resolve(newOrder);
      }, 1000);
    });
  },
  
  getUserOrders: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, we would filter orders by the user ID
        // For mock purposes, we'll return all orders
        const userOrders = orders.filter(
          (order) => order.user.id === '1'
        );
        resolve(userOrders);
      }, 1000);
    });
  },
  
  getAllOrders: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(orders);
      }, 1000);
    });
  },
  
  updateOrderStatus: async (orderId, status) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const order = orders.find((o) => o.id === orderId);
        
        if (order) {
          order.status = status;
          resolve(order);
        } else {
          reject({ message: 'Order not found' });
        }
      }, 1000);
    });
  },
};

export default orderService;