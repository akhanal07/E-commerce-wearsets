import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/mongoose';
import Order from '../../../models/Order';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated
    const session = await getSession({ req });
    
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    await dbConnect();
    
    const { cartItems, totalPrice, shippingAddress } = req.body;
    
    // Create a dummy payment ID
    const paymentId = 'DUMMY_' + Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    
    // Create order in database
    const order = await Order.create({
      user: session.user.id,
      products: cartItems.map(item => ({
        product: {
          _id: item._id,
          name: item.name,
          price: item.price,
          image: item.image
        },
        quantity: item.quantity
      })),
      totalAmount: totalPrice,
      paymentInfo: {
        id: paymentId,
        status: 'success',
        method: 'dummy'
      },
      shippingAddress
    });
    
    return res.status(200).json({
      success: true,
      order,
      paymentId
    });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
