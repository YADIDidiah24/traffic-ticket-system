// src/routes/tickets/+page.server.ts
import type { Actions, ServerLoad, Action } from '@sveltejs/kit';
import db from '$lib/server/db.ts';
import { trafficTicketsTable, usersTable } from '$lib/server/schema.ts';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// Load tickets with user information
export const load: ServerLoad = async () => {
  try {
    const tickets = await db.select({
      id: trafficTicketsTable.id,
      userId: trafficTicketsTable.userId,
      userName: usersTable.fullName,
      licensePlate: trafficTicketsTable.licensePlate,
      violationType: trafficTicketsTable.violationType,
      fineAmount: trafficTicketsTable.fineAmount,
      dateIssued: trafficTicketsTable.dateIssued,
      status: trafficTicketsTable.status
    }).from(trafficTicketsTable)
      .leftJoin(usersTable, eq(trafficTicketsTable.userId, usersTable.id));

    const users = await db.select().from(usersTable);

    return { tickets, users };
  } catch (error) {
    console.error('Failed to load tickets:', error);
    return { tickets: [], users: [] };
  }
};

// Handle form actions for traffic tickets
export const actions: Actions = {
  // Create a new traffic ticket
  create: (async ({ request }) => {
    const data = await request.formData();
    const userId = data.get('userId')?.toString();
    const licensePlate = data.get('licensePlate')?.toString();
    const violationType = data.get('violationType')?.toString();
    const fineAmount = Number(data.get('fineAmount'));
    const status = data.get('status')?.toString() || 'unpaid';

    if (status !== 'unpaid' && status !== 'paid') {
        return fail(400, { error: 'Invalid status value. Allowed values are "unpaid" or "paid".' });
      }

    // Validation
    if (!userId || !licensePlate || !violationType || isNaN(fineAmount)) {
      return fail(400, { 
        error: 'Invalid ticket information',
        userId,
        licensePlate,
        violationType,
        fineAmount: fineAmount.toString(),
        status
      });
    }

    try {
      const [newTicket] = await db.insert(trafficTicketsTable).values({
        userId,
        licensePlate,
        violationType,
        fineAmount,
        status
      }).returning();

      return { success: true, ticket: newTicket };
    } catch (error) {
      console.error('Ticket creation failed:', error);
      return fail(500, { 
        error: 'Failed to create ticket',
        userId,
        licensePlate,
        violationType,
        fineAmount: fineAmount.toString(),
        status
      });
    }
  }) satisfies Action, // ✅ Fixes TS7031 error

  // Update ticket status
  updateStatus: (async ({ request }) => {
    const data = await request.formData();
    const id = Number(data.get('id'));
    const status = data.get('status')?.toString();

    if (!id || !status) {
      return fail(400, { error: 'Ticket ID and status are required' });
    }

    if (status !== 'unpaid' && status !== 'paid') {
        return fail(400, { error: 'Invalid status value. Allowed values are "unpaid" or "paid".' });
      }

    try {
      const [updatedTicket] = await db.update(trafficTicketsTable)
        .set({ status })
        .where(eq(trafficTicketsTable.id, id))
        .returning();

      return { success: true, ticket: updatedTicket };
    } catch (error) {
      console.error('Ticket update failed:', error);
      return fail(500, { error: 'Failed to update ticket status' });
    }
  }) satisfies Action, // ✅ Fixes TS7031 error

  // Delete a ticket
  delete: (async ({ request }) => {
    const data = await request.formData();
    const id = Number(data.get('id'));

    if (!id) {
      return fail(400, { error: 'Ticket ID is required' });
    }

    try {
      const [deletedTicket] = await db.delete(trafficTicketsTable)
        .where(eq(trafficTicketsTable.id, id))
        .returning();

      return { success: true, ticket: deletedTicket };
    } catch (error) {
      console.error('Ticket deletion failed:', error);
      return fail(500, { error: 'Failed to delete ticket' });
    }
  }) satisfies Action // ✅ Fixes TS7031 error
};
