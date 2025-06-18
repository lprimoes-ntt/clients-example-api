import { drizzle } from "drizzle-orm/bun-sqlite"
import { appEnvironment } from "@/env"

export const dbContext = drizzle(appEnvironment.DB_FILE_NAME)
