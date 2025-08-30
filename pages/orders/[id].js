import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Head from 'next/head';

const OrderDetails = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/orders/' + id);
    }

    // Fetch order details
    if (session && id) {
      fetchOrderDetails();
    }
  }, [session, status, id, router]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  if (!order) {
    return (
      <div className="profile-container">
        <h1>Order Not Found</h1>
        <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link href="/profile">
          <a className="view-order-btn">Back to Profile</a>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Order Details | Ayush's Store</title>
      </Head>
      <div className="profile-container">
        <div className="order-header">
          <h1>Order Details</h1>
          <Link href="/profile">
            <a className="view-order-btn">Back to Profile</a>
          </Link>
        </div>
        
        <div className="order-details">
          <div className="order-main">
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="order-info-row">
                <p>Order ID:</p>
                <p>{order._id}</p>
              </div>
              <div className="order-info-row">
                <p>Date:</p>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="order-info-row">
                <p>Status:</p>
                <p>
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
                </p>
              </div>
              <div className="order-info-row">
                <p>Payment Method:</p>
                <p>{order.paymentInfo.method === 'dummy' ? 'Dummy Payment (Test)' : order.paymentInfo.method}</p>
              </div>
            </div>
            
            <div className="order-items-container">
              <h2>Items</h2>
              <div className="order-items">
                {order.products.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="order-item-image-container">
                      {item.product.image && item.product.image[0] && (
                        <img
                          src={item.product.image[0].asset.url}
                          alt={item.product.name}
                          className="order-item-image"
                        />
                      )}
                    </div>
                    <div className="order-item-details">
                      <h3 className="order-item-name">{item.product.name}</h3>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <p className="order-item-price">${item.product.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="order-sidebar">
            <div className="order-address">
              <h2>Shipping Address</h2>
              {order.shippingAddress ? (
                <div className="address-details">
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p>No shipping address provided</p>
              )}
            </div>
            
            <div className="order-totals">
              <h2>Order Total</h2>
              <div className="order-total-row">
                <p>Subtotal</p>
                <p>${order.totalAmount}</p>
              </div>
              <div className="order-total-row">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <div className="order-total-row order-final-total">
                <p>Total</p>
                <p>${order.totalAmount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
