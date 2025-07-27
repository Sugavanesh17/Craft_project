import connectDB from '../../../lib/mongodb';
import Project from '../../../models/Project';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Replace with env variable in production

function getUserIdFromRequest(request) {
  const auth = request.headers.get('authorization');
  if (!auth) return null;
  const token = auth.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(request) {
  await connectDB();
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const projects = await Project.find({ user: userId }).sort({ deadline: 1 });
  return Response.json(projects);
}

export async function POST(request) {
  await connectDB();
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { name, description, status, deadline } = await request.json();
  if (!name) {
    return Response.json({ message: 'Project name is required' }, { status: 400 });
  }
  const project = await Project.create({
    name,
    description,
    status,
    deadline,
    user: userId,
  });
  return Response.json(project, { status: 201 });
} 