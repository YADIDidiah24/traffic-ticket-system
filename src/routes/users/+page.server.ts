import db from '$lib/server/db.js'; 
import { users } from '$lib/db/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async () => {
  try {
    const allUsers = await db.select().from(users);
    
    return {
      users: allUsers
    };
  } catch (error) {
    console.error('Failed to load users:', error);
    return {
      users: [],
      error: 'Failed to load users'
    };
  }
};

export const actions = {
  createUser: async ({ request }) => {
    const formData = await request.formData();
    
    const fullName = formData.get('fullName')?.toString();
    const email = formData.get('email')?.toString();
    const phoneNumber = formData.get('phoneNumber')?.toString() || null;
    const address = formData.get('address')?.toString() || null;
    
    if (!fullName || !email) {
      return fail(400, { 
        error: 'Full name and email are required',
        values: { fullName, email, phoneNumber, address }
      });
    }
    
    try {
      await db.insert(users).values({
        fullName,
        email,
        phoneNumber,
        address
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to create user:', error);
      
      if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string' && error.message.includes('unique constraint')) {
        return fail(400, { 
            error: 'Email already exists',
            values: {  fullName, email, phoneNumber, address }
            });
    }
      
      return fail(500, { 
        error: 'Failed to create user',
        values: { fullName, email, phoneNumber, address }
      });
    }
  },
  
  deleteUser: async ({ request }) => {
    const formData = await request.formData();
    const userId = formData.get('id')?.toString();
    
    if (!userId) {
      return fail(400, { error: 'User ID is required' });
    }
    
    try {
      await db.delete(users).where(eq(users.id, userId));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete user:', error);
      return fail(500, { error: 'Failed to delete user' });
    }
  },
  
  updateUser: async ({ request }) => {
    const formData = await request.formData();
    
    const userId = formData.get('id')?.toString();
    const fullName = formData.get('fullName')?.toString();
    const email = formData.get('email')?.toString();
    const phoneNumber = formData.get('phoneNumber')?.toString() || null;
    const address = formData.get('address')?.toString() || null;
    
    if (!userId || !fullName || !email) {
      return fail(400, { 
        error: 'User ID, full name, and email are required',
        values: { userId, fullName, email, phoneNumber, address }
      });
    }
    
    try {
      await db.update(users)
        .set({
          fullName,
          email,
          phoneNumber,
          address
        })
        .where(eq(users.id, userId));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to update user:', error);
      

    if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string' && error.message.includes('unique constraint')) {
        return fail(400, { 
            error: 'Email already exists',
            values: { userId, fullName, email, phoneNumber, address }
            });
    }
      
      return fail(500, { 
        error: 'Failed to update user',
        values: { userId, fullName, email, phoneNumber, address }
      });
    }
  }
};