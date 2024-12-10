import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import Axios for making requests
import './GetOrders.css';  // You can reuse your CSS file from the previous component

const OrderList = () => {
  const [orders, setOrders] = useState([]);  // State to store the list of orders
  const [loading, setLoading] = useState(true);  // State for loading indicator
  const [error, setError] = useState(null);  // State for handling errors

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Make GET request to the backend
        const response = await axios.get('http://localhost:5000/orders');
        
        // Set the orders to state
        setOrders(response.data);
        setLoading(false);  // Stop loading after data is fetched
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again.');
        setLoading(false);
      }
    };

    fetchOrders();  // Call the function to fetch orders
  }, []);  // Empty dependency array to run only once when the component mounts

  // If loading, display a loading message
  if (loading) {
    return <div>Loading orders...</div>;
  }

  // If there is an error, display an error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="order-list-container">
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <h3>Order from {order.customerName}</h3>
              <p>Email: {order.customerEmail}</p>
              <p>Seat Number : {order.seatNumber}</p>
              <p>Status: {order.status}</p>
              <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
              <h4>Items:</h4>
              <ul>
                {order.cartItems.map((item, index) => (
                  <li key={index}>
                    {item.name} x {item.quantity} - ${item.price.toFixed(2)} each
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;
