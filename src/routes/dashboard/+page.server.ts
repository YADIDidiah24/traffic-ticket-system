import { error } from '@sveltejs/kit';
import db from '$lib/server/db';
import { trafficTickets, users } from '$lib/db/schema';
import { eq, sql, desc, and, gte, lte } from 'drizzle-orm';

export async function load({ url }) {
  try {
    // Get date range filter parameters
    const startDate = url.searchParams.get('startDate') || getDateXDaysAgo(30);
    const endDate = url.searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    
    // Basic statistics
    const [
      totalTicketsResult,
      unpaidTicketsResult,
      paidTicketsResult,
      totalCollectedResult,
      avgFineResult,
      mostCommonViolationsResult,
      ticketTrendResult,
      topOffendersResult
    ] = await Promise.all([
      // Total tickets
      db.select({ count: sql<number>`count(*)` }).from(trafficTickets),
      
      // Unpaid tickets
      db.select({ count: sql<number>`count(*)` }).from(trafficTickets)
        .where(eq(trafficTickets.status, 'unpaid')),
      
      // Paid tickets
      db.select({ count: sql<number>`count(*)` }).from(trafficTickets)
        .where(eq(trafficTickets.status, 'paid')),
      
      // Total amount collected
      db.select({ sum: sql<number>`sum(${trafficTickets.fineAmount})` })
        .from(trafficTickets)
        .where(eq(trafficTickets.status, 'paid')),
      
      // Average fine amount
      db.select({ avg: sql<number>`avg(${trafficTickets.fineAmount})` })
        .from(trafficTickets),
      
      // Most common violations
      db.select({
        violationType: trafficTickets.violationType,
        count: sql<number>`count(*)`,
        totalRevenue: sql<number>`sum(CASE WHEN ${trafficTickets.status} = 'paid' THEN ${trafficTickets.fineAmount} ELSE 0 END)`
      })
      .from(trafficTickets)
      .groupBy(trafficTickets.violationType)
      .orderBy(sql`count(*) DESC`)
      .limit(5),
      
      // Ticket trend over time (by month)
      db.select({
        month: sql<string>`to_char(${trafficTickets.dateIssued}, 'YYYY-MM')`,
        count: sql<number>`count(*)`,
        paid: sql<number>`sum(CASE WHEN ${trafficTickets.status} = 'paid' THEN 1 ELSE 0 END)`,
        unpaid: sql<number>`sum(CASE WHEN ${trafficTickets.status} = 'unpaid' THEN 1 ELSE 0 END)`,
        revenue: sql<number>`sum(CASE WHEN ${trafficTickets.status} = 'paid' THEN ${trafficTickets.fineAmount} ELSE 0 END)`
      })
      .from(trafficTickets)
      .where(and(
        gte(trafficTickets.dateIssued, new Date(startDate)),
        lte(trafficTickets.dateIssued, new Date(endDate))
      ))
      .groupBy(sql`to_char(${trafficTickets.dateIssued}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${trafficTickets.dateIssued}, 'YYYY-MM')`),
      
      // Top offenders
      db.select({
        userId: trafficTickets.userId,
        fullName: users.fullName,
        ticketCount: sql<number>`count(*)`,
        totalFines: sql<number>`sum(${trafficTickets.fineAmount})`,
        unpaidCount: sql<number>`sum(CASE WHEN ${trafficTickets.status} = 'unpaid' THEN 1 ELSE 0 END)`,
        unpaidAmount: sql<number>`sum(CASE WHEN ${trafficTickets.status} = 'unpaid' THEN ${trafficTickets.fineAmount} ELSE 0 END)`
      })
      .from(trafficTickets)
      .leftJoin(users, eq(trafficTickets.userId, users.id))
      .groupBy(trafficTickets.userId, users.fullName)
      .orderBy(sql`count(*) DESC`)
      .limit(10)
    ]);
    
    // Recent tickets for quick reference
    const recentTickets = await db
      .select({
        ticket: trafficTickets,
        user: {
          fullName: users.fullName,
          email: users.email
        }
      })
      .from(trafficTickets)
      .leftJoin(users, eq(trafficTickets.userId, users.id))
      .orderBy(desc(trafficTickets.dateIssued))
      .limit(10);

    return {
      dateRange: {
        startDate,
        endDate
      },
      stats: {
        totalTickets: totalTicketsResult[0]?.count || 0,
        unpaidTickets: unpaidTicketsResult[0]?.count || 0,
        paidTickets: paidTicketsResult[0]?.count || 0,
        totalCollected: totalCollectedResult[0]?.sum || 0,
        averageFine: avgFineResult[0]?.avg || 0
      },
      recentTickets,
      mostCommonViolations: mostCommonViolationsResult || [],
      ticketTrend: ticketTrendResult || [],
      topOffenders: topOffendersResult || []
    };
  } catch (err) {
    console.error('Error loading dashboard data:', err);
    throw error(500, 'Failed to load dashboard data');
  }
}

// Helper function to get date from X days ago in YYYY-MM-DD format
function getDateXDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

export const actions = {
  // You can add form actions here if needed for the dashboard
  // For example, to export data, change date ranges, etc.
  exportData: async ({ request }) => {
    // Implementation for data export would go here
    return { success: true };
  }
};