import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useStateContext } from '../context/StateContext';
import Head from 'next/head';

const Checkout = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartItems, totalPrice, setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleDummyPayment = async (e) => {
    e.preventDefault();
    
    if (!session) {
      toast.error('Please sign in to complete your purchase');
      router.push('/auth/signin?callbackUrl=/checkout');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/payment/dummy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          totalPrice,
          shippingAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      // Clear cart
      setCartItems([]);
      setTotalPrice(0);
      setTotalQuantities(0);
      
      // Redirect to success page with order ID
      router.push(`/success?order_id=${data.order._id}`);
      
    } catch (error) {
      toast.error(error.message || 'Payment failed');
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Checkout | Ayush's Store</title>
      </Head>
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        {!session ? (
          <div className="checkout-account-section">
            <h2>Account</h2>
            <p>Please sign in to complete your purchase</p>
            <button
              onClick={() => signIn(null, { callbackUrl: '/checkout' })}
              className="auth-submit-btn"
              style={{ marginTop: '15px', width: 'auto', padding: '8px 20px' }}
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="checkout-account-section">
            <h2>Account</h2>
            <p>Signed in as {session.user.name} ({session.user.email})</p>
          </div>
        )}

        <div className="checkout-grid">
          <div className="checkout-left">
            <div className="checkout-form">
              <h2>Shipping Address</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter your street address"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleChange}
                      required
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleChange}
                      required
                      placeholder="State/Province"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleChange}
                      required
                      placeholder="Postal/ZIP code"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleChange}
                      required
                      placeholder="Country"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="checkout-form" style={{ marginTop: '20px' }}>
              <h2>Payment Method</h2>
              <div className="payment-method-option">
                <input
                  type="radio"
                  id="dummy-payment"
                  name="payment-method"
                  checked
                  readOnly
                />
                <label htmlFor="dummy-payment">
                  Dummy Payment (Test Mode)
                </label>
              </div>
              <p className="payment-note">
                This is a dummy payment method for testing purposes. No real payment will be processed.
              </p>
            </div>
          </div>
          
          <div className="checkout-right">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  <div className="order-items">
                    {cartItems.map((item) => (
                      <div key={item._id} className="order-item">
                        <div className="order-item-image-container">
                          <img
                            src={item.image[0] && item.image[0].asset.url}
                            alt={item.name}
                            className="order-item-image"
                          />
                        </div>
                        <div className="order-item-details">
                          <h3 className="order-item-name">{item.name}</h3>
                          <p>Qty: {item.quantity}</p>
                        </div>
                        <p className="order-item-price">${item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-totals">
                    <div className="order-total-row">
                      <p>Subtotal</p>
                      <p>${totalPrice}</p>
                    </div>
                    <div className="order-total-row">
                      <p>Shipping</p>
                      <p>Free</p>
                    </div>
                    <div className="order-total-row order-final-total">
                      <p>Total</p>
                      <p>${totalPrice}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleDummyPayment}
                    disabled={isLoading || !session || Object.values(shippingAddress).some(field => !field)}
                    className="auth-submit-btn"
                    style={{ marginTop: '20px' }}
                  >
                    {isLoading ? 'Processing...' : 'Complete Order'}
                  </button>
                  
                  {!session && (
                    <p className="checkout-note">
                      Please sign in to complete your purchase
                    </p>
                  )}
                  
                  {session && Object.values(shippingAddress).some(field => !field) && (
                    <p className="checkout-note">
                      Please fill in all shipping address fields
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
