import { and, eq } from "drizzle-orm"
import Elysia, { t } from "elysia"
import { dbContext } from "@/db/context"
import { usersTable } from "@/db/schema"

export const deleteEndpoint = new Elysia().delete(
	"/api/clients/:id",
	async ({ params, status, headers }) => {
		const clientId = params.id

		// Check if client exists
		const existingClient = await dbContext
			.select()
			.from(usersTable)
			.where(
				and(eq(usersTable.id, clientId), eq(usersTable.groupId, headers["x-group-id"])),
			)
			.limit(1)

		if (existingClient.length === 0) {
			return status(404, { message: "Client not found" })
		}

		await dbContext.delete(usersTable).where(eq(usersTable.id, clientId))

		return {
			message: "Client deleted successfully",
			deletedId: clientId,
		}
	},
	{
		headers: t.Object({
			"x-group-id": t.Numeric({
				minimum: 1,
				examples: [25],
				error: "Group ID header is required",
			}),
		}),
		params: t.Object({
			id: t.Numeric({
				error: "ID is required and must be a positive integer",
			}),
		}),
		response: {
			200: t.Object({
				message: t.String({ example: "Client deleted successfully" }),
				deletedId: t.Number({ example: 1 }),
			}),
			400: t.Object({
				message: t.String({ example: "One or more validation errors occurred" }),
				errors: t.Object({
					id: t.Array(
						t.String({ example: "ID is required and must be a positive integer" }),
					),
				}),
			}),
			404: t.Object({
				message: t.String({ example: "Client not found" }),
			}),
		},
		detail: {
			summary: "Delete a client",
			tags: ["Clients"],
		},
	},
)
