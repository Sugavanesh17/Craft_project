import connectDB from '../../../../lib/mongodb';
import Project from '../../../../models/Project';
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

export async function GET(request, { params }) {
  await connectDB();
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const project = await Project.findOne({ _id: id, user: userId });
  if (!project) {
    return Response.json({ message: 'Project not found' }, { status: 404 });
  }
  return Response.json(project);
}

export async function DELETE(request, { params }) {
  await connectDB();
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const project = await Project.findOne({ _id: id, user: userId });
  if (!project) {
    return Response.json({ message: 'Project not found' }, { status: 404 });
  }
  await project.deleteOne();
  return Response.json({ message: 'Project deleted' });
}

export async function PATCH(request, { params }) {
  await connectDB();
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const { status } = await request.json();
  if (!['Planned', 'In Progress', 'Completed'].includes(status)) {
    return Response.json({ message: 'Invalid status' }, { status: 400 });
  }
  const project = await Project.findOneAndUpdate(
    { _id: id, user: userId },
    { status },
    { new: true }
  );
  if (!project) {
    return Response.json({ message: 'Project not found' }, { status: 404 });
  }
  return Response.json(project);
} 