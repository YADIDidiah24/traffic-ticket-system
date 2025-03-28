// src/routes/tickets/$types.ts
import type { User, TrafficTicket } from '$lib/server/schema.ts';

export type PageData = {
  tickets: (TrafficTicket & { userName?: string })[];
  users: User[];
};

export type ActionData = {
  error?: string;
  userId?: string;
  licensePlate?: string;
  violationType?: string;
  fineAmount?: string;
  status?: string;
  success?: boolean;
};