import { and, eq } from "drizzle-orm"
import Elysia, { t } from "elysia"
import { dbContext } from "@/db/context"
import { usersTable } from "@/db/schema"

export const updateEndpoint = new Elysia().put(
	"/api/clients/:id",
	async ({ params, body, status, headers }) => {
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

		const [updatedClient] = await dbContext
			.update(usersTable)
			.set({
				name: body.name,
				contactEmail: body.contactEmail,
				revenue: body.revenue,
			})
			.where(eq(usersTable.id, clientId))
			.returning()

		return {
			id: updatedClient.id,
			name: updatedClient.name,
			contactEmail: updatedClient.contactEmail,
			revenue: updatedClient.revenue,
			startDate: updatedClient.startDate,
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
		body: t.Object({
			name: t.String({
				minLength: 1,
				maxLength: 255,
				examples: ["Acme Inc."],
				error: "Name is required and must be between 1 and 255 characters",
			}),
			contactEmail: t.String({
				format: "email",
				maxLength: 255,
				examples: ["john.doe@acme.com"],
				error: "Contact email is required and must be a valid email address",
			}),
			revenue: t.Number({
				minimum: 1,
				examples: [584390.23],
				error: "Revenue is required and must be greater than 1",
			}),
		}),
		response: {
			200: t.Object({
				id: t.Number({ example: 1 }),
				name: t.String({ example: "Acme Inc." }),
				contactEmail: t.String({ example: "john.doe@acme.com" }),
				revenue: t.Number({ example: 584390.23 }),
				startDate: t.Date({ example: "2021-04-25T12:23:16.000Z" }),
			}),
			400: t.Object({
				message: t.String({ example: "One or more validation errors occurred" }),
				errors: t.Object({
					name: t.Array(
						t.String({
							example: "Name is required and must be between 1 and 255 characters",
						}),
					),
				}),
			}),
			404: t.Object({
				message: t.String({ example: "Client not found" }),
			}),
		},
		detail: {
			summary: "Update an existing client",
			tags: ["Clients"],
		},
	},
)
