const express = require("express");
const ExpressError = require("./expressError");
const ITEMS = require("./fakeDB");
const router = new express.Router();

// Shopping Routes Go here
router.get("/", (req, res) => {
	return res.json({ items: ITEMS });
});

router.post("/", (req, res, next) => {
	console.log(req.body);
	try {
		if (!req.body.name || !req.body.price) {
			throw new ExpressError("JSON must include 'name' and 'price'.", 400);
		}
		const newItem = { name: req.body.name, price: req.body.price };
		ITEMS.push(newItem);
		return res.status(201).json({ added: newItem });
	} catch (error) {
		return next(error);
	}
});

router.get("/:name", (req, res, next) => {
	try {
		const item = ITEMS.find((i) => i.name === req.params.name);
		if (!item) {
			throw new ExpressError("Item not found", 400);
		}
		return res.json(item);
	} catch (error) {
		return next(error);
	}
});

router.patch("/:name", (req, res, next) => {
	try {
		const idx = ITEMS.findIndex((i) => i.name === req.params.name);
		if (idx === -1) {
			throw new ExpressError("Item not found", 400);
		}
		const item = ITEMS[idx];
		item.name = req.body.name || item.name;
		item.price = req.body.price || item.price;
		return res.json({ updated: item });
	} catch (error) {
		return next(error);
	}
});

router.delete("/:name", (req, res, next) => {
	try {
		const idx = ITEMS.findIndex((i) => i.name === req.params.name);
		if (idx === -1) {
			throw new ExpressError("Item not found", 400);
		}
		ITEMS.splice(idx, 1);
		return res.json({ message: "Deleted" });
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
