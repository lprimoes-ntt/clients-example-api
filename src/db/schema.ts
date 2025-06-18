import { index, int, real, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const usersTable = sqliteTable(
	"clients",
	{
		id: int().primaryKey({ autoIncrement: true }),
		groupId: int().notNull(),
		name: text().notNull(),
		contactEmail: text().notNull(),
		revenue: real().notNull(),
		startDate: int({ mode: "timestamp" }).notNull(),
	},
	(table) => [index("idx_clients_group_id").on(table.groupId)],
)
