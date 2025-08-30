import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

import { useStateContext } from '../context/StateContext';
import { runFireworks } from '../lib/utils';

const Success = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { order_id } = router.query;
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Clear cart
    localStorage.clear();
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    runFireworks();
    
    // Fetch order details if order_id is available
    if (order_id && session) {
      setLoading(true);
      fetch(`/api/orders/${order_id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch order details');
          }
          return response.json();
        })
        .then(data => {
          setOrderDetails(data.order);
        })
        .catch(error => {
          console.error('Error fetching order details:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [order_id, session]);

  return (
    <>
      <Head>
        <title>Order Successful | Ayush's Store</title>
      </Head>
      <div className="success-wrapper">
        <div className="success">
          <p className="success-icon">
            <BsBagCheckFill />
          </p>
          <h2>Thank you for your order{session ? `, ${session.user.name}` : ''}!</h2>
          <p className="success-email-msg">Your order confirmation has been sent to your email.</p>
          
          {order_id && (
            <div className="success-order-info">
              <p className="success-order-id">Order ID: {order_id}</p>
              
              {loading ? (
                <p className="success-loading">Loading order details...</p>
              ) : orderDetails ? (
                <div className="success-order-summary">
                  <div className="success-order-row">
                    <p>Total:</p>
                    <p className="success-order-total">${orderDetails.totalAmount}</p>
                  </div>
                  <div className="success-order-row">
                    <p>Status:</p>
                    <p>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: 
                          orderDetails.status === 'delivered' ? '#e6f7e6' : 
                          orderDetails.status === 'shipped' ? '#e6f0ff' :
                          orderDetails.status === 'processing' ? '#fff8e6' :
                          orderDetails.status === 'cancelled' ? '#ffe6e6' :
                          '#f2f2f2',
                        color: 
                          orderDetails.status === 'delivered' ? '#2e7d32' : 
                          orderDetails.status === 'shipped' ? '#1565c0' :
                          orderDetails.status === 'processing' ? '#ed6c02' :
                          orderDetails.status === 'cancelled' ? '#d32f2f' :
                          '#616161'
                      }}>
                        {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}
          
          <p className="success-description">
            For any questions about your order, please email us at{' '}
            <a className="success-email" href="mailto:support@ayushsstore.com">
              support@ayushsstore.com
            </a>
          </p>
          
          <div className="success-buttons">
            <Link href="/">
              <a className="primary-button">
                Continue Shopping
              </a>
            </Link>
            
            {order_id && (
              <Link href={`/orders/${order_id}`}>
                <a className="secondary-button">
                  View Order Details
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Success