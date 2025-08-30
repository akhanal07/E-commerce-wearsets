import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Head from 'next/head';

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/profile');
    }

    // Fetch user orders
    if (session) {
      fetchOrders();
    }
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Head>
        <title>My Profile | Ayush's Store</title>
      </Head>
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
        </div>
        
        <div className="profile-info">
          <h2>Account Information</h2>
          <div className="profile-detail">
            <strong>Name:</strong> {session.user.name}
          </div>
          <div className="profile-detail">
            <strong>Email:</strong> {session.user.email}
          </div>
          <button
            onClick={handleSignOut}
            className="auth-submit-btn"
            style={{ marginTop: '20px', width: 'auto', padding: '8px 20px' }}
          >
            Sign Out
          </button>
        </div>
        
        <div className="order-history">
          <h2>Order History</h2>
          
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <p style={{ marginBottom: '15px' }}>You haven't placed any orders yet.</p>
              <Link href="/">
                <a className="auth-submit-btn" style={{ display: 'inline-block', padding: '8px 20px' }}>
                  Start Shopping
                </a>
              </Link>
            </div>
          ) : (
            <table className="order-history-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.substring(0, 8)}...</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>${order.totalAmount}</td>
                    <td>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: 
                          order.status === 'delivered' ? '#e6f7e6' : 
                          order.status === 'shipped' ? '#e6f0ff' :
                          order.status === 'processing' ? '#fff8e6' :
                          order.status === 'cancelled' ? '#ffe6e6' :
                          '#f2f2f2',
                        color: 
                          order.status === 'delivered' ? '#2e7d32' : 
                          order.status === 'shipped' ? '#1565c0' :
                          order.status === 'processing' ? '#ed6c02' :
                          order.status === 'cancelled' ? '#d32f2f' :
                          '#616161'
                      }}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <Link href={`/orders/${order._id}`}>
                        <a className="view-order-btn">View</a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
