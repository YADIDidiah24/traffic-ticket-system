// src/routes/tickets/[id]/+page.server.ts
import  db  from '$lib/server/db';
import { trafficTickets } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types'; // Import RequestEvent type

export async function load({ params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return { error: 'Invalid ticket ID' };
    }

    const ticket = await db.select().from(trafficTickets).where(eq(trafficTickets.id, id)).limit(1);
    if (!ticket.length) {
      return { error: 'Ticket not found' };
    }

    return { ticket: ticket[0] };
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return { error: 'Failed to load ticket' };
  }
}



export async function PATCH({ params, request }: RequestEvent) { // Add type annotation
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return json({ error: 'Invalid ticket ID' }, { status: 400 });
    }

    const ticketData = await request.json();

    const updatedTicket = await db
      .update(trafficTickets)
      .set({
        licensePlate: ticketData.licensePlate,
        violationType: ticketData.violationType,
        fineAmount: ticketData.fineAmount,
        dateIssued: ticketData.dateIssued ? new Date(ticketData.dateIssued) : undefined,
        status: ticketData.status,
      })
      .where(eq(trafficTickets.id, id))
      .returning();

    if (!updatedTicket || updatedTicket.length === 0) {
      return json({ error: 'Ticket not found' }, { status: 404 });
    }

    return json(updatedTicket[0]);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
