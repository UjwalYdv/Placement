//
//  index.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './adapters/inbound/http/routes';
import { runMigrations } from './infrastructure/db/migrations';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function start(): Promise<void> {
  try {
    await runMigrations();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
