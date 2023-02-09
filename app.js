const express = require("express");
const ExpressError = require("./expressError");
const shoppingRoutes = require("./shoppingRoutes");

const app = express();
app.use(express.json());

app.use("/items", shoppingRoutes);

// Error Handler
app.use((err, req, res, next) => {
	let status = err.status || 500;

	return res.status(status).json({
		error: {
			message: err.message,
			status: status,
		},
	});
});

module.exports = app;

app.listen(3000, () => {
	console.log("Server started on port 3000...");
});
