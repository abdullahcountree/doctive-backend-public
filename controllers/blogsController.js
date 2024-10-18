const Blog = require('../models/blogModel');
const upload = require('../multer-config');

// Create a new blog
exports.addBlog = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        const { title, description } = req.body;

        if (!title || !description || !req.file) {
            return res.status(400).json({ message: 'Title, description, and image are required' });
        }

        const newBlog = new Blog({
            title,
            description,
            image: `/uploads/${req.file.filename}`,
        });

        newBlog.save()
            .then(blog => res.status(201).json(blog))
            .catch(error => res.status(500).json({ message: 'Error saving blog', error }));
    });
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blogs', error: err });
    }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blog', error: err });
    }
};

// Update a blog by ID
exports.updateBlog = async (req, res) => {
    const { id } = req.params;
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        const { title, description } = req.body;
        const updateData = { title, description };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        try {
            const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            res.status(200).json(blog);
        } catch (err) {
            res.status(500).json({ message: 'Error updating blog', error: err });
        }
    });
};

// Delete a blog by ID
exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting blog', error: err });
    }
};
