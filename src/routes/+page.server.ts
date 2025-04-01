import { error } from '@sveltejs/kit';
import db from '$lib/server/db';
import { trafficTickets, users } from '$lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function load() {
  try {
    // Fetch recent tickets (last 5) and statistics
    const [recentTickets, totalTicketsResult, unpaidTicketsResult, totalCollectedResult] = await Promise.all([
      db.select().from(trafficTickets).orderBy(desc(trafficTickets.dateIssued)).limit(5),
      db.select({ count: sql<number>`count(*)` }).from(trafficTickets),
      db.select({ count: sql<number>`count(*)` }).from(trafficTickets).where(eq(trafficTickets.status, 'unpaid')),
      db.select({ sum: sql<number>`sum(${trafficTickets.fineAmount})` }).from(trafficTickets).where(eq(trafficTickets.status, 'paid')),
    ]);

    const totalTickets = totalTicketsResult[0]?.count || 0;
    const unpaidTickets = unpaidTicketsResult[0]?.count || 0;
    const totalCollected = totalCollectedResult[0]?.sum || 0;

    return {
      recentTickets,
      stats: {
        totalTickets,
        unpaidTickets,
        totalCollected,
      }
    };
  } catch (err) {
    console.error('Error loading home page data:', err);
    throw error(500, 'Failed to load home page data');
  }
}