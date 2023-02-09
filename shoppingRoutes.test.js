process.env.NODE_ENV = "test";

const app = require("./app");
let items = require("./fakeDB");
// let item1 = { name: "shoes", price: 150 };

beforeEach(() => {
	items.push({ name: "shoes", price: 150 });
	console.log(`BEFORE: ${JSON.stringify(items)}`);
});

afterEach(() => {
	// items.length = 0;
	items.splice(0, items.length);
	console.log("Array reset!");
	console.log(`Items: ${JSON.stringify(items)}`);
});

describe("GET /items", () => {
	test("get all items", async () => {
		const res = await request(app).get("/items");
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ items: [{ name: "shoes", price: 150 }] });
	});
});

describe("GET /items/:name", () => {
	test("get item by name", async () => {
		const res = await request(app).get("/items/shoes");
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ name: "shoes", price: 150 });
	});
	test("get 400 error for nonexistent item", async () => {
		const res = await request(app).get("/items/sandals");
		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("error");
		expect(res.body).toHaveProperty("error.message");
		expect(res.body).toHaveProperty("error.status");
	});
});

describe("POST /items", () => {
	test("successfully add item", async () => {
		const res = await request(app)
			.post("/items")
			.send({ name: "airpods", price: 150 });
		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty("added");
		expect(res.body).toEqual({ added: { name: "airpods", price: 150 } });
		expect(items.length).toEqual(2);
	});
	test("disallows adding an item for requests lacking proper properties", async () => {
		const res = await request(app).post("/items").send({ name: "newItem" });
		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("error");
	});
});

describe("/PATCH /items/:name", () => {
	test("Updating an existing item's price", async () => {
		const res = await request(app)
			.patch("/items/shoes")
			.send({ name: "shoes", price: 349 });
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("updated");
		expect(res.body).toEqual({ updated: { name: "shoes", price: 250 } });
	});
	test("Update an existing items name", async () => {
		const res = await request(app)
			.patch("/items/shoes")
			.send({ name: "sneakers" });
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("updated");
		expect(res.body).toEqual({ updated: { name: "sneakers ", price: 400 } });
	});
	test("Error response if item doesn't exist", async () => {
		const res = await request(app)
			.patch("/items/sandals")
			.send({ name: "Sandals" });
		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("error");
	});
});

describe("/DELETE /items/:name", () => {
	test("Error response if item doesn't exist", async () => {
		const res = await request(app).delete("/items/sandals");
		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("error");
	});
	test("Successfully deletes existing item", async () => {
		const res = await request(app).delete("/items/shoes");
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("message");
	});
});
