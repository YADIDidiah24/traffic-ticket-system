// // src/routes/api/users/[id]/tickets/+server.js - GET tickets for a specific user

// import { json } from '@sveltejs/kit';
// import db from '$lib/server/db.js'; 
// import { users, trafficTickets } from '$lib/db/schema.js';
// import { eq } from 'drizzle-orm';

// export async function GET({ params, url }) {
//   try {
//     const { id } = params;
//     const status = url.searchParams.get('status'); // 'paid', 'unpaid', or null for all
    
//     // Check if user exists
//     const userExists = await db.select({ id: users.id })
//       .from(users)
//       .where(eq(users.id, id))
//       .limit(1);
      
//     if (!userExists.length) {
//       return json({ error: 'User not found' }, { status: 404 });
//     }
    
//     // Query for tickets
//     let query = db.select()
//       .from(trafficTickets)
//       .where(eq(trafficTickets.userId, id))
//       .orderBy(desc(trafficTickets.dateIssued));
      
//     // Filter by status if provided
//     if (status && ['paid', 'unpaid'].includes(status)) {
//       query = query.where(eq(trafficTickets.status, status));
//     }
    
//     const tickets = await query;
    
//     return json({
//       userId: id,
//       ticketCount: tickets.length,
//       tickets: tickets
//     });
//   } catch (error) {
//     console.error('Error fetching user tickets:', error);
//     return json({ error: 'Failed to fetch user tickets' }, { status: 500 });
//   }
// }