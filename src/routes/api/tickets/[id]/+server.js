// src/routes/api/tickets/[id]/+server.js - GET, PATCH, DELETE for specific ticket
import { json } from '@sveltejs/kit';
import db from '$lib/server/db.js';
import { trafficTickets } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';

// GET a specific ticket by UUID
export async function GET({ params }) {
  try {
    const id = parseInt(params.id, 10); // Convert to number

    if (isNaN(id)) {
      return json({ error: 'Invalid ticket ID' }, { status: 400 });
    }

    const ticket = await db.select()
      .from(trafficTickets)
      .where(eq(trafficTickets.id, id))
      .limit(1);

    if (!ticket.length) {
      return json({ error: 'Ticket not found' }, { status: 404 });
    }

    return json(ticket[0]);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return json({ error: 'Failed to fetch ticket' }, { status: 500 });
  }
}

// UPDATE a specific ticket
export async function PATCH({ request, params }) {
  try {
    const id = parseInt(params.id, 10); // Convert to number

    if (isNaN(id)) {
      return json({ error: 'Invalid ticket ID' }, { status: 400 });
    }

    const body = await request.json();

    // Check if ticket exists
    const existingTicket = await db.select()
      .from(trafficTickets)
      .where(eq(trafficTickets.id, id))
      .limit(1);

    if (!existingTicket.length) {
      return json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Update the ticket
    const updatedTicket = await db.update(trafficTickets)
      .set({
        licensePlate: body.licensePlate ?? existingTicket[0].licensePlate,
        violationType: body.violationType ?? existingTicket[0].violationType,
        fineAmount: body.fineAmount ?? existingTicket[0].fineAmount,
        status: body.status ?? existingTicket[0].status,
        dateIssued: body.dateIssued ?? existingTicket[0].dateIssued,
      })
      .where(eq(trafficTickets.id, id))
      .returning();

    return json(updatedTicket[0]);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}

// DELETE a specific ticket
export async function DELETE({ params }) {
  try {
    const id = parseInt(params.id, 10); // Convert to number

    if (isNaN(id)) {
      return json({ error: 'Invalid ticket ID' }, { status: 400 });
    }

    // Check if ticket exists
    const existingTicket = await db.select()
      .from(trafficTickets)
      .where(eq(trafficTickets.id, id))
      .limit(1);

    if (!existingTicket.length) {
      return json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Delete the ticket
    await db.delete(trafficTickets)
      .where(eq(trafficTickets.id, id));

    return json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return json({ error: 'Failed to delete ticket' }, { status: 500 });
  }
}
