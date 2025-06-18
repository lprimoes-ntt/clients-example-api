import Elysia, { t } from "elysia"
import { dbContext } from "@/db/context"
import { usersTable } from "@/db/schema"

export const createEndpoint = new Elysia().post(
	"/api/clients",
	async ({ body, headers }) => {
		const [newClient] = await dbContext
			.insert(usersTable)
			.values({
				name: body.name,
				groupId: headers["x-group-id"],
				contactEmail: body.contactEmail,
				revenue: body.revenue,
				startDate: body.startDate,
			})
			.returning()

		return {
			id: newClient.id,
			name: newClient.name,
			contactEmail: newClient.contactEmail,
			revenue: newClient.revenue,
			startDate: newClient.startDate,
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
			startDate: t.Date({
				minimum: new Date("1970-01-01"),
				examples: ["2021-04-25T12:23:16.000Z"],
				error: "Start date is required and must be a valid date",
			}),
		}),
		response: {
			"200": t.Object({
				id: t.Number({ example: 1 }),
				name: t.String({ example: "Acme Inc." }),
				contactEmail: t.String({ example: "john.doe@acme.com" }),
				revenue: t.Number({ example: 584390.23 }),
				startDate: t.Date({ example: "2021-04-25T12:23:16.000Z" }),
			}),
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
			summary: "Create a new client",
			tags: ["Clients"],
		},
	},
)
