import { Elysia, redirect } from "elysia"
import { createEndpoint } from "@/endpoints/create"
import { deleteEndpoint } from "@/endpoints/delete"
import { getByIdEndpoint } from "@/endpoints/getById"
import { searchEndpoint } from "@/endpoints/search"
import { updateEndpoint } from "@/endpoints/update"
import { corsPlugin, swaggerPlugin } from "./plugins"

const app = new Elysia()
	// Error handler
	.onError(({ code, error, status }) => {
		if (code === "VALIDATION") {
			const errors: Record<string, string[]> = {}

			for (const validationError of error.validator.Errors(error.value)) {
				const path = validationError.path.substring(1)
				if (!errors[path]) {
					errors[path] = [validationError.schema.error]
				} else if (!errors[path].includes(validationError.schema.error)) {
					errors[path].push(validationError.schema.error)
				}
			}

			return status(400, {
				message: "One or more validation errors occurred",
				errors: errors,
			})
		}

		console.error(error)

		return status(500, {
			message: "Internal server error",
		})
	})

	// Plugins
	.use(swaggerPlugin)
	.use(corsPlugin)

	// Endpoints
	.use(searchEndpoint)
	.use(getByIdEndpoint)
	.use(createEndpoint)
	.use(updateEndpoint)
	.use(deleteEndpoint)

	// Redirect to Swagger
	.get("/", () => {
		return redirect("/swagger")
	})

	// Start server
	.listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
console.log("📚 Available endpoints:")
console.log("  GET    /clients      - Search/list all clients")
console.log("  GET    /clients/:id  - Get client by ID")
console.log("  POST   /clients      - Create new client")
console.log("  PUT    /clients/:id  - Update client")
console.log("  DELETE /clients/:id  - Delete client")
