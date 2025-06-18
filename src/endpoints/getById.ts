import { and, eq } from "drizzle-orm"
import Elysia, { t } from "elysia"
import { dbContext } from "@/db/context"
import { usersTable } from "@/db/schema"

export const getByIdEndpoint = new Elysia().get(
	"/api/clients/:id",
	async ({ params, status, headers }) => {
		const clientId = params.id

		const [client] = await dbContext
			.select({
				id: usersTable.id,
				name: usersTable.name,
				contactEmail: usersTable.contactEmail,
				revenue: usersTable.revenue,
				startDate: usersTable.startDate,
			})
			.from(usersTable)
			.where(
				and(eq(usersTable.id, clientId), eq(usersTable.groupId, headers["x-group-id"])),
			)
			.limit(1)

		if (!client) {
			return status(404, { message: "Client not found" })
		}

		return client
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
				id: t.Number({ example: 1 }),
				name: t.String({ example: "Acme Inc." }),
				contactEmail: t.String({ example: "john.doe@acme.com" }),
				revenue: t.Number({ example: 584390.23 }),
				startDate: t.Date({ example: "2021-04-25T12:23:16.000Z" }),
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
			summary: "Get a client by ID",
			tags: ["Clients"],
		},
	},
)
