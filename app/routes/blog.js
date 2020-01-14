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

router.get('/count',
    blogController.getCount
)

// Get blog list
router.get('/',
    blogController.searchBlogs
)

// Get a blog detail
router.get('/:id',
    blogController.getBlogDetail
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
    blogController.addBlog
)

// Add a cover image to a blog
router.post('/:id/cover',
    blogController.addCoverToBlog
)

// Update a blog
router.put('/:id',
    blogController.updateBlog
)

// Delete a blog
router.delete('/:id',
    blogController.deleteBlog
)

// Add a comment
router.post('/:id/comments',
    blogValidator.addComment,
    blogController.addComment
)

// Update a comment
router.put('/:id/comments/:commentId',
    blogValidator.addComment,
    blogController.updateComment
)

// Delete a comment
router.delete('/:id/comments/:commentId',
    blogController.deleteComment
)

module.exports = router
