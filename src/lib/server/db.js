// src/lib/server/db.ts

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const traffic_ticket_system = "postgresql://neondb_owner:npg_Bl9Ro4DtcKNO@ep-polished-star-a53td37l-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require";
const test_db = "postgresql://tst_owner:npg_4IMu6QVBycAv@ep-fancy-sea-a5ct2znc-pooler.us-east-2.aws.neon.tech/tst?sslmode=require";
const sql = neon(traffic_ticket_system);
const db = drizzle(sql);


export default db;
