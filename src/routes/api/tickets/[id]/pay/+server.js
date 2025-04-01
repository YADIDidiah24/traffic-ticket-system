// src/routes/api/tickets/[id]/pay/+server.js
import { json } from '@sveltejs/kit';
import db from '$lib/server/db.js'; 
import { trafficTickets } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';

export async function PATCH({ params }) {
  try {
    // const id = params.id; // Keep as UUID, no conversion
    const id = parseInt(params.id, 10);
    // Check if ticket exists
    const existingTicket = await db.select()
      .from(trafficTickets)
      .where(eq(trafficTickets.id, id))
      .limit(1);
      
    if (!existingTicket.length) {
      return json({ error: 'Ticket not found' }, { status: 404 });
    }

    // If already paid
    if (existingTicket[0].status === 'paid') {
      return json({ message: 'Ticket is already marked as paid' });
    }

    // Mark the ticket as paid
    const updatedTicket = await db.update(trafficTickets)
      .set({ status: 'paid' })
      .where(eq(trafficTickets.id, id))
      .returning();

    return json({ 
      success: true, 
      message: 'Ticket marked as paid', 
      ticket: updatedTicket[0] 
    });

  } catch (error) {
    console.error('Error paying ticket:', error);
    return json({ error: 'Failed to mark ticket as paid' }, { status: 500 });
  }
}


