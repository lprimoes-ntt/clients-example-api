import { type AnyColumn, and, asc, desc, eq, like } from "drizzle-orm"
import Elysia, { t } from "elysia"
import { dbContext } from "@/db/context"
import { usersTable } from "@/db/schema"

const orderByOpyions: Record<string, AnyColumn> = {
	name: usersTable.name,
	contactEmail: usersTable.contactEmail,
	revenue: usersTable.revenue,
	startDate: usersTable.startDate,
}

export const searchEndpoint = new Elysia().get(
	"/api/clients",
	async ({ query, headers }) => {
		// Apply filters
		const filters = []
		if (query.name) {
			filters.push(like(usersTable.name, `%${query.name}%`))
		}
		if (query.contactEmail) {
			filters.push(like(usersTable.contactEmail, `%${query.contactEmail}%`))
		}

		// Apply ordering
		const direction = query.orderDirection === "desc" ? desc : asc
		const column = orderByOpyions[query.orderBy ?? "name"]

		const clients = await dbContext
			.select({
				id: usersTable.id,
				name: usersTable.name,
				contactEmail: usersTable.contactEmail,
				revenue: usersTable.revenue,
				startDate: usersTable.startDate,
			})
			.from(usersTable)
			.where(and(...filters, eq(usersTable.groupId, headers["x-group-id"])))
			.orderBy(direction(column))

		return clients
	},
	{
		headers: t.Object({
			"x-group-id": t.Numeric({
				minimum: 1,
				examples: [25],
				error: "Group ID header is required",
			}),
		}),
		query: t.Object({
			name: t.Optional(
				t.String({
					minLength: 1,
					maxLength: 255,
					examples: ["Acme Inc."],
					error: "Name is required and must be between 1 and 255 characters",
				}),
			),
			contactEmail: t.Optional(
				t.String({
					maxLength: 255,
					examples: ["john.doe@acme.com"],
					error: "Contact email is required and must be between 1 and 255 characters",
				}),
			),
			orderBy: t.Optional(
				t.UnionEnum(["name", "contactEmail", "revenue", "startDate"], {
					examples: ["name"],
					error:
						"Order by is required and must be one of: name, contactEmail, revenue, startDate",
				}),
			),
			orderDirection: t.Optional(
				t.UnionEnum(["asc", "desc"], {
					examples: ["asc"],
					error: "Order direction is required and must be one of: asc, desc",
				}),
			),
		}),
		response: {
			"200": t.Array(
				t.Object({
					id: t.Number({ example: 1 }),
					name: t.String({ example: "Acme Inc." }),
					contactEmail: t.String({ example: "john.doe@acme.com" }),
					revenue: t.Number({ example: 584390.23 }),
					startDate: t.Date({ example: "2021-04-25T12:23:16.000Z" }),
				}),
			),
			"400": t.Object({
				message: t.String({ example: "One or more validation errors occurred" }),
				errors: t.Object({
					name: t.Array(
						t.String({
							example: "Name is required and must be between 1 and 255 characters",
						}),
					),
				}),
			}),
		},
		detail: {
			summary: "Search for clients",
			description: "Search for clients by name or contact email and ordered by any field",
			tags: ["Clients"],
		},
	},
)
