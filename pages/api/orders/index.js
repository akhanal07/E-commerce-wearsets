import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/mongoose';
import Order from '../../../models/Order';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  await dbConnect();
  
  try {
    if (req.method === 'GET') {
      const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 });
      
      return res.status(200).json({ success: true, orders });
    }
    
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
