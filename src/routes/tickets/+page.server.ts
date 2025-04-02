// src/routes/tickets/+page.server.ts
import { error, fail } from '@sveltejs/kit';
import db from '$lib/server/db';
import { trafficTickets, users } from '$lib/db/schema';
import {eq, ilike, or, and, asc, desc  } from 'drizzle-orm';

import {  pgEnum } from 'drizzle-orm/pg-core';

const ticketStatusEnum = pgEnum('ticket_status', ['unpaid', 'paid']);

export type TicketStatus = 'unpaid' | 'paid';
const validSortFields = {
  licensePlate: trafficTickets.licensePlate,
  violationType: trafficTickets.violationType,
  fineAmount: trafficTickets.fineAmount,
  dateIssued: trafficTickets.dateIssued,
  status: trafficTickets.status,
} as const;

type SortField = keyof typeof validSortFields;
type SortOrder = 'asc' | 'desc';

export async function load({ url }: { url: URL }) {
  try {
    // Parse query parameters with proper type checking
    const userId = url.searchParams.get('userId');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const sortBy = url.searchParams.get('sortBy') as SortField || 'dateIssued';
    const sortOrder = url.searchParams.get('sortOrder')?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    

    // Build where conditions
    const filters = [];

    // Apply user filter if provided
    if (userId) {
      filters.push(eq(trafficTickets.userId, userId));
    }
    
    // Apply status filter if valid
    if (status && ['paid', 'unpaid'].includes(status)) {
      filters.push(eq(trafficTickets.status, status as TicketStatus));
    }

    // Apply search filter across multiple fields
    if (search.trim()) {
      filters.push(
        or(
          ilike(trafficTickets.licensePlate, `%${search}%`),
          ilike(trafficTickets.violationType, `%${search}%`),
          ilike(users.fullName, `%${search}%`)
        )
      );
    }

    // Determine sort direction function and field
    const orderFunc = sortOrder === 'asc' ? asc : desc;
    const sortField = sortBy in validSortFields 
      ? validSortFields[sortBy] 
      : trafficTickets.dateIssued;

    // Build and execute the query all at once to avoid type issues
    const ticketsWithUsers = await db
      .select({
        ticket: trafficTickets,
        user: users,
      })
      .from(trafficTickets)
      .leftJoin(users, eq(trafficTickets.userId, users.id))
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(orderFunc(sortField));

    // Transform results to a clean format
    const tickets = ticketsWithUsers.map(({ ticket, user }) => ({
      ...ticket,
      user: user
        ? {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
          }
        : null,
    }));

    // Get all users for the dropdown
    const allUsers = await db.select().from(users);

    return {
      tickets,
      users: allUsers,
      filters: { 
        search, 
        status, 
        userId, 
        sortBy, 
        sortOrder 
      },
    };
  } catch (err) {
    console.error('Error fetching tickets with users:', err);
    return {
      tickets: [],
      users: [],
      error: 'Failed to load tickets and user data',
      filters: { 
        search: '', 
        status: '', 
        userId: '', 
        sortBy: 'dateIssued' as SortField, 
        sortOrder: 'desc' as SortOrder 
      },
    };
  }
}


// Handle form submissions for creating new tickets
export const actions = {
  // Create a new ticket
  createTicket: async ({ request, fetch }: { request: Request; fetch: typeof globalThis.fetch }) => {
    try {
      const formData = await request.formData();
      
      // Extract form values
      const userId = formData.get('userId');
      const licensePlate = formData.get('licensePlate');
      const violationType = formData.get('violationType');
      const fineAmount = parseFloat(formData.get('fineAmount')?.toString() || 'NaN');
      const dateIssued = formData.get('dateIssued') || new Date().toISOString();
      const status = formData.get('status') || 'unpaid';
      
      // Validate required fields
      if (!userId || !licensePlate || !violationType || isNaN(fineAmount)) {
        return fail(400, { 
          error: 'Missing required fields',
          values: { userId, licensePlate, violationType, fineAmount, dateIssued, status }
        });
      }
      
      // Create ticket using the API endpoint
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          licensePlate,
          violationType,
          fineAmount,
          dateIssued,
          status
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return fail(response.status, { 
          error: errorData.error || 'Failed to create ticket',
          values: { userId, licensePlate, violationType, fineAmount, dateIssued, status }
        });
      }
      
      const newTicket = await response.json();
      return { success: true, ticket: newTicket };
    } catch (err) {
      console.error('Error creating ticket:', err);
      return fail(500, { error: 'Failed to create ticket' });
    }
  },
  
  // Update an existing ticket
  updateTicket: async ({ request }: { request: Request }) => {
    try {
        const formData = await request.formData();

        const id = parseInt(formData.get('id')?.toString() || 'NaN', 10);
        if (isNaN(id)) {
            return fail(400, { error: 'Invalid ticket ID' });
        }

        const licensePlate = formData.get('licensePlate')?.toString();
        const violationType = formData.get('violationType')?.toString();
        const fineAmount = parseFloat(formData.get('fineAmount')?.toString() || 'NaN');
        const dateIssued = formData.get('dateIssued')?.toString()? new Date(formData.get('dateIssued')!.toString()): undefined;        
        const status = formData.get('status')?.toString();
        let validatedStatus: "unpaid" | "paid" | undefined = undefined;
        if (status === "unpaid" || status === "paid") {
          validatedStatus = status;
        }
        const updatedTicket = await db
            .update(trafficTickets)
            .set({
                licensePlate,
                violationType,
                fineAmount,
                dateIssued,
                status: validatedStatus,
            })
            .where(eq(trafficTickets.id, id))
            .returning();

        if (!updatedTicket || updatedTicket.length === 0) {
            return fail(404, { error: 'Ticket not found' });
        }

        return { success: true, ticket: updatedTicket[0] };
    } catch (err) {
        console.error('Error updating ticket:', err);
        return fail(500, { error: 'Failed to update ticket' });
    }
},
  
  // Delete a ticket
  deleteTicket: async ({ request, fetch }: { request: Request; fetch: typeof globalThis.fetch }) => {
    try {
      const formData = await request.formData();
      
      const id = formData.get('id');
      if (!id) {
        return fail(400, { error: 'Missing ticket ID' });
      }
      
      // Delete ticket using the API endpoint
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return fail(response.status, { 
          error: errorData.error || 'Failed to delete ticket'
        });
      }
      
      return { success: true, message: 'Ticket deleted successfully' };
    } catch (err) {
      console.error('Error deleting ticket:', err);
      return fail(500, { error: 'Failed to delete ticket' });
    }
  },
  
  // Pay a ticket
  payTicket: async ({ request, fetch }: { request: Request; fetch: typeof globalThis.fetch }) => {
    try {
      const formData = await request.formData();
      
      const id = formData.get('id');
      if (!id) {
        return fail(400, { error: 'Missing ticket ID' });
      }
      
      // Pay ticket using the API endpoint
      const response = await fetch(`/api/tickets/${id}/pay`, {
        method: 'PATCH'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return fail(response.status, { 
          error: errorData.error || 'Failed to pay ticket'
        });
      }
      
      const result = await response.json();
      return { 
        success: true, 
        message: result.message, 
        ticket: result.ticket 
      };
    } catch (err) {
      console.error('Error paying ticket:', err);
      return fail(500, { error: 'Failed to pay ticket' });
    }
  }
};