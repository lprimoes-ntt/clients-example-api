import { appEnvironment } from '@/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: appEnvironment.DB_FILE_NAME,
  },
});
