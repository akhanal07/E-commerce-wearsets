import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/mongoose';
import Order from '../../../models/Order';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  const { id } = req.query;
  
  await dbConnect();
  
  try {
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to the authenticated user
    if (order.user.toString() !== session.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
