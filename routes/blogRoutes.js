const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogsController');

// Create a blog
router.post('/add', blogController.addBlog);

// Get all blogs
router.get('/', blogController.getAllBlogs);

// Get a single blog by ID
router.get('/:id', blogController.getBlogById);

// Update a blog
router.put('/:id', blogController.updateBlog);

// Delete a blog
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
