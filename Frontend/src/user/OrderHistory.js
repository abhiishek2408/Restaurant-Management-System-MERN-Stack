import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../context/UseContext';

const OrderHistory = () => {
  const { user } = useContext(UserContext);
  const [effectiveUser, setEffectiveUser] = useState(user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Restore user from localStorage if context is empty
  useEffect(() => {
    if (!user || !user._id) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setEffectiveUser(JSON.parse(storedUser));
      } else {
        setError("User not logged in.");
        setLoading(false);
      }
    } else {
      setEffectiveUser(user);
    }
  }, [user]);

  // Fetch orders once we have a valid user
  useEffect(() => {
    if (!effectiveUser || !effectiveUser._id) return;

    fetch('http://localhost:5000/api/orders/order-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ user_id: effectiveUser._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data);
          setError('');
        } else {
          setError(data.message || 'No orders found.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Error fetching orders.');
        setLoading(false);
      });
  }, [effectiveUser]);

  if (loading) return <p>Loading your order history...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Your Completed Orders</h2>

      {orders.length === 0 ? (
        <p>No completed orders found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map((order) => (
            <div
              key={order.cart_id}
              style={{
                display: 'flex',
                gap: '20px',
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <img
                src={order.item_image ? `data:image/jpeg;base64,${order.item_image}` : 'https://via.placeholder.com/100'}
                alt={order.item_name}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />


              <div>
                <h4>{order.item_name}</h4>
                <p>Quantity: {order.quantity}</p>
                <p>Price: ₹{order.price}</p>
                <p>Delivery Address: {order.delivery_address}</p>
                <p>Ordered At: {new Date(order.added_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
