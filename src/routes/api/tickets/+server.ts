// src/routes/api/tickets/+server.js
import { json } from '@sveltejs/kit';
import db from '$lib/server/db.js'; 
import { trafficTickets, users } from '$lib/db/schema.js';
import { desc, eq } from 'drizzle-orm';

// GET all tickets or filtered by userId
export async function GET({ url }) {
  try {
    const userId = url.searchParams.get('userId');
    let query;

    if (userId) {
      query = db
        .select()
        .from(trafficTickets)
        .where(eq(trafficTickets.userId, userId)) // No conversion to Number
        .orderBy(desc(trafficTickets.dateIssued));
    } else {
      query = db
        .select()
        .from(trafficTickets)
        .orderBy(desc(trafficTickets.dateIssued));
    }

    const tickets = await query;
    return json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    console.log('Request Body:', body);

    if (!body.userId || !body.licensePlate || !body.violationType || !body.fineAmount) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = body.userId; // Keep as UUID, no conversion

    // Check if the userId exists
    const userExists = await db.select().from(users).where(eq(users.id, userId));
    console.log('User Exists Check:', userExists);

    if (userExists.length === 0) {
      return json({ error: 'User ID does not exist' }, { status: 400 });
    }

    const dateIssued = body.dateIssued ? new Date(body.dateIssued) : new Date();

    const newTicket = await db.insert(trafficTickets)
      .values({
        userId, 
        licensePlate: body.licensePlate,
        violationType: body.violationType,
        fineAmount: body.fineAmount,
        dateIssued,
        status: body.status ?? 'unpaid'
      })
      .returning();

    console.log('New Ticket Inserted:', newTicket);
    return json(newTicket[0], { status: 201 });

  } catch (error) {
    console.error('Error creating ticket:', error);
    if (error instanceof Error) {
      return json({
        error: 'Failed to create ticket',
        details: { message: error.message, stack: error.stack },
      }, { status: 500 });
    }
    return json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}

