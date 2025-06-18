import { z } from "zod"

const environmentSchema = z.object({
	DB_FILE_NAME: z.string(),
})

export const appEnvironment = environmentSchema.parse(process.env)
