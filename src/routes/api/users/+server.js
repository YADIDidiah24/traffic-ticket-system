import { json } from '@sveltejs/kit';
import  db  from '$lib/server/db.js';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

// GET all users
export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    return json(allUsers);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST - Create a new user
export async function POST({ request }) {
  try {
    const userData = await request.json();
    
    // Validate required fields
    if (!userData.fullName || !userData.email) {
      return json({ error: 'Full name and email are required' }, { status: 400 });
    }
    
    const newUser = await db.insert(users).values({
      fullName: userData.fullName,
      email: userData.email,
      phoneNumber: userData.phoneNumber || null,
      address: userData.address || null
    }).returning();
    
    return json(newUser[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    
    // Check for unique constraint violation
    if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string' && error.message.includes('unique constraint')) {
        return json({ error: 'Email already exists' }, { status: 409 });
      }
    
    return json({ error: 'Failed to create user' }, { status: 500 });
  }
}