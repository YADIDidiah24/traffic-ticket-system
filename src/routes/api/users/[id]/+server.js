import { json } from '@sveltejs/kit';
import  db  from '$lib/server/db.js';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

// GET a specific user by ID
export async function GET({ params }) {
  try {
    const userId = params.id;
    
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (user.length === 0) {
      return json({ error: 'User not found' }, { status: 404 });
    }
    
    return json(user[0]);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT - Update a user
export async function PUT({ params, request }) {
  try {
    const userId = params.id;
    const userData = await request.json();
    
    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (existingUser.length === 0) {
      return json({ error: 'User not found' }, { status: 404 });
    }
    
    // Update user
    const updatedUser = await db.update(users)
      .set({
        fullName: userData.fullName !== undefined ? userData.fullName : existingUser[0].fullName,
        email: userData.email !== undefined ? userData.email : existingUser[0].email,
        phoneNumber: userData.phoneNumber !== undefined ? userData.phoneNumber : existingUser[0].phoneNumber,
        address: userData.address !== undefined ? userData.address : existingUser[0].address
      })
      .where(eq(users.id, userId))
      .returning();
    
    return json(updatedUser[0]);
  } catch (error) {
    console.error('Failed to update user:', error);
    
    // Check for unique constraint violation
    if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string' && error.message.includes('unique constraint')) {
        return json({ error: 'Email already exists' }, { status: 409 });
      }
    
    return json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE - Remove a user
export async function DELETE({ params }) {
  try {
    const userId = params.id;
    
    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (existingUser.length === 0) {
      return json({ error: 'User not found' }, { status: 404 });
    }
    
    // Delete user
    await db.delete(users).where(eq(users.id, userId));
    
    return json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return json({ error: 'Failed to delete user' }, { status: 500 });
  }
}