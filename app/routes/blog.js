const express = require('express')

const authMiddleware = require('../middleware/auth')
const blogValidator = require('../middleware/validator/blog')
const blogController = require('../controllers/blog')


const router = express.Router()

// Get tag list
router.get('/tags', (req, res) => {
    res.json({
        tags: require('../models/tags')
    })
})

// Get blog list
router.get('/',
    blogController.getBlogs
)

// Get a blog detail
router.get('/:id',
    blogController.getBlogs
)

// Authentication required
router.use(
    authMiddleware.authRequired,
    authMiddleware.sessionValid,
    authMiddleware.notExpired
)

// Post a blog
router.post('/',
    blogValidator.addBlog,
    blogController.getBlogs
)

// Edit a blog
router.put('/:id',
    blogController.getBlogs
)

// Delete a blog
router.delete('/:id',
    blogController.getBlogs
)

// Add a comment
router.post('/:id/comments',
    blogValidator.addComment,
    blogController.getBlogs
)

// Edit a comment
router.put('/:id/comments/:commentId',
    blogController.getBlogs
)

// Delete a comment
router.delete('/:id/comments/:commentId',
    blogController.getBlogs
)

module.exports = router
