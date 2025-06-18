import { cors } from "@elysiajs/cors"
import { swagger } from "@elysiajs/swagger"
import Elysia from "elysia"

export const swaggerPlugin = new Elysia().use(
	swagger({
		documentation: {
			info: {
				title: "Clients API",
				version: "1.0.0",
			},
			tags: [
				{
					name: "Clients",
					description: "API endpoints for managing clients",
				},
			],
		},
		exclude: ["/"],
		scalarConfig: {
			defaultOpenAllTags: true,
			darkMode: true,
			hideDarkModeToggle: true,
		},
		swaggerOptions: {
			defaultModelExpandDepth: -1,
			defaultModelRendering: "example",
			defaultModelsExpandDepth: -1,
		},
	}),
)

export const corsPlugin = new Elysia().use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["*"],
		credentials: true,
	}),
)
