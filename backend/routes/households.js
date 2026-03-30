const express = require('express');
const router = express.Router();

// Placeholder route
router.get('/', (req, res) => {
    res.json({ message: "Households route working" });
});

module.exports = router; // This is the part Express was missing!