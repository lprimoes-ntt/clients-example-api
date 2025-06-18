import { faker } from "@faker-js/faker"
import { dbContext } from "./context"
import { usersTable } from "./schema"

// Check if table already has records
const existingRecords = await dbContext.select().from(usersTable).limit(1)
if (existingRecords.length > 0) {
	console.log("Table already has records, skipping seed...")
	dbContext.$client.close()
	process.exit(0)
}

console.log("Seeding database with 50 clients per group with 30 groups...")

const clients = []
for (let i = 1; i <= 30; i++) {
	for (let j = 0; j < 50; j++) {
		clients.push({
			name: faker.company.name(),
			groupId: i,
			contactEmail: faker.internet.email(),
			revenue: faker.number.float({ min: 1000, max: 1000000, fractionDigits: 2 }),
			startDate: faker.date.past(),
		})
	}
}

await dbContext.insert(usersTable).values(clients)

dbContext.$client.close()
