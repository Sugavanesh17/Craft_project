import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Replace with env variable in production

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return Response.json({ message: 'Email and password are required' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    return Response.json({ token }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
} 