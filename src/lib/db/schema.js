// // src/lib/db/schema.js
import { pgTable, serial, uuid, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Create the status enum
export const ticketStatusEnum = pgEnum('ticket_status', ['unpaid', 'paid']);

// Define the traffic_tickets table
export const trafficTickets = pgTable('traffic_tickets', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  licensePlate: text('license_plate').notNull(),
  violationType: text('violation_type').notNull(),
  fineAmount: integer('fine_amount').notNull(),
  dateIssued: timestamp('date_issued').defaultNow(),
  status: text('status', { enum: ['unpaid', 'paid'] }).default('unpaid')
});



export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  phoneNumber: text('phone_number'),
  address: text('address')
});


