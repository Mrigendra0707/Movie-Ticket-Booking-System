import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import './Food.css';

// A list of food items typically served in a movie theater
const foodItems = [
  { name: 'Popcorn', description: 'Classic buttered popcorn', price: 5.00 },
  { name: 'Nachos', description: 'With melted cheese and jalapeños', price: 6.50 },
  { name: 'Candy', description: 'Assorted candy options', price: 3.50 },
  { name: 'Soft Drink', description: 'Soda of your choice', price: 4.00 },
  { name: 'Hot Dog', description: 'Served with ketchup or mustard', price: 7.00 },
  { name: 'Ice Cream', description: 'Creamy and cold, various flavors', price: 4.50 },
  { name: 'Slushie', description: 'Refreshing icy drinks in various flavors', price: 5.00 },
  { name: 'Pretzel', description: 'Soft and warm, served with cheese', price: 4.75 },
  { name: 'Pizza Slice', description: 'Cheese or pepperoni, served hot', price: 8.00 },
  { name: 'Chicken Tenders', description: 'Crispy and juicy, served with dipping sauce', price: 7.50 },
];

const MovieTheaterMenu = () => {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [seatNumber, setseatNumber] = useState('');

  const addToCart = (item) => {
    setCart([...cart, item]);
    alert(`${item.name} added to your cart!`);
  };

  const handleOrder = async () => {
    // Check if customer name and email are provided
    if (!customerName || !customerEmail) {
      alert('Please enter your name and email before placing the order.');
      return;
    }

    try {
      // Send POST request to the backend
      const response = await  axios.post('http://localhost:5000/order', {
        cartItems: cart, // Send the cart items to the backend
        customerName,
        customerEmail,
        seatNumber
      });

      if (response.status === 200) {
        alert('Order placed successfully!');
        setCart([]); // Clear the cart after successful order
      } else {
        alert('Failed to place the order.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    }
  };

  return (
    <div className="menu-container">
      <h2 className="menu-title">Movie Theater Menu</h2>
      <ul className="food-list">
        {foodItems.map((item, index) => (
          <li key={index} className="food-item">
            <div className="food-header">
              <h3 className="food-name">{item.name}</h3>
              <span className="food-price">${item.price.toFixed(2)}</span>
            </div>
            <p className="food-description">{item.description}</p>
            <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>

      {cart.length > 0 && (
        <div className="cart-summary">
          <h3>Your Cart</h3>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>{item.name} - ${item.price.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Customer Name and Email Inputs */}
      <div className="customer-info">
        <input
          type="text"
          placeholder="Your Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Seat Number"
          onChange={(e) => setseatNumber(e.target.value)}
        />
      </div>

      <button className="add-to-cart-btn btn2" onClick={handleOrder}>
        Order
      </button>
    </div>
  );
};

export default MovieTheaterMenu;
