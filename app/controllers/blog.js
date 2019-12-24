const fs = require('fs')
const uuidv4 = require('uuid/v4')
const { matchedData } = require('express-validator')
const formidable = require('formidable')

const { handleError } = require('../middleware/common')
const Blog = require('../models/blog')
const Comment = require('../models/comment')


module.exports = {
    async getBlogs(req, res) {
        const query = req.query
        if (!query.page) {
            query.page = 1
        }

        if (!query.pageSize) {
            query.pageSize = parseInt(process.env.DEFAULT_PAGE_SIZE)
        }

        if (!query.sort) {
            query.sort = 'createdAt'
        }

        if (!query.ascend) {
            query.ascend = true
        }

        const dbQuery = Blog.find({})
            .select('user cover title short description tags likes dislikes claps edited')
            .sort({ [query.sort]: query.ascend ? 1 : -1 })
            .skip(query.pageSize * (query.page - 1))
            .limit(query.pageSize)
            .populate({
                path: 'user',
                select: '_id name profile',
                populate: {
                    path: 'profile',
                    select: '-_id title avatar'
                }
            })

        try {
            const blogs = await new Promise((resolve, reject) => {
                dbQuery.exec((error, res) => {
                    if (error) {
                        return reject(error)
                    }

                    resolve(res)
                })
            })

            res.json({
                data: blogs
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async getBlogDetail(req, res) {
        const dbQuery = Blog.findById(req.params.id)
            .populate({
                path: 'user',
                select: '_id name profile',
                populate: {
                    path: 'profile',
                    select: '-_id title avatar twitter github linkedin facebook marks'
                }
            })

        try {
            const blog = await new Promise((resolve, reject) => {
                dbQuery.exec((error, res) => {
                    if (error) {
                        return reject(error)
                    }

                    resolve(res)
                })
            })

            const comments = await findCommentsForBlog(blog._id)
            blog._doc.comments = comments

            res.json({
                data: blog
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async addBlog(req, res) {
        const user = req.user

        try {
            const body = matchedData(req)
            const blog = new Blog({
                user: user._id,
                title: body.title,
                short: req.body.short,
                tags: body.tags,
                description: body.description
            })

            await blog.save()
            res.json({
                success: 'Blog has been posted successfully'
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async addCoverToBlog(req, res) {
        const user = req.user

        try {
            const blog = await findBlogById(req.params.id)
            if (user._id !== blog.user) {
                return res.status(401).json({
                    errors: 'Different user'
                })
            }

            const form = new formidable.IncomingForm()
            form.encoding = 'utf-8'
            form.keepExtensions = true

            form.maxFileSize = process.env.MAX_FILE_SIZE
            const path = await new Promise((resolve, reject) => {
                form.parse(req)
                    .on('fileBegin', (name, file) => {
                        const folder = `${process.env.MEDIA_ROOT}/blogs/cover`
                        if (!fs.existsSync(folder)) {
                            fs.mkdirSync(folder, { recursive: true })
                        }

                        file.name = `${uuidv4()}-${file.name}`
                        file.path = `${folder}/${file.name}`
                        console.log(file.path)
                    })
                    .on('error', error => reject(error))
                    .on('file', (name, file) => {
                        resolve(file.name)
                    })
            })

            blog.cover = `${process.env.CLIENT_URL}/blogs/cover/${path}`
            await blog.save()
            res.json({
                cover: blog.cover
            })
        } catch (error) {
            handleError(error)
        }
    },

    async updateBlog(req, res) {
        const user = req.user

        try {
            const body = req.body
            const blog = await findBlogById(req.params.id)
            if (user._id.toString() !== blog.user.toString()) {
                return res.status(401).json({
                    errors: 'Different user'
                })
            }

            for (let key in body) {
                blog[key] = body[key]
            }

            await blog.save()
            res.json({
                blog: blog
            })
        } catch (error) {
            handleError(error)
        }
    },

    async deleteBlog(req, res) {
        const user = req.user

        try {
            const id = req.params.id
            const blog = await findBlogById(id)
            if (user._id.toString() !== blog.user.toString()) {
                return res.status(401).json({
                    errors: 'Different user'
                })
            }

            await findBlogByIdAndDelete(id)
            res.json({
                success: 'Blog has been deleted successfully'
            })
        } catch (error) {
            handleError(error)
        }
    },

    async addComment(req, res) {
        const user = req.user

        try {
            const body = matchedData(req)
            const blog = await findBlogById(req.params.id)
            const comment = new Comment({
                user: user._id,
                blog: blog._id,
                content: body.content
            })

            await comment.save()
            res.json({
                success: 'Comment has been added successfully'
            })
        } catch (error) {
            handleError(error)
        }
    },

    async updateComment(req, res) {
        const user = req.user

        try {
            const commentId = req.params.commentId
            const comment = await findCommentById(commentId)
            if (user._id.toString() !== comment.user.toString()) {
                return res.status(401).json({
                    errors: 'Different user'
                })
            }

            const body = matchedData(req)
            comment.content = body.content
            await comment.save()
            res.json({
                success: 'Comment has been changed successfully'
            })
        } catch (error) {
            handleError(error)
        }
    },

    async deleteComment(req, res) {
        const user = req.user

        try {
            const commentId = req.params.commentId
            const comment = await findCommentById(commentId)
            console.log(comment, user._id)
            if (user._id.toString() !== comment.user.toString()) {
                return res.status(401).json({
                    errors: 'Different user'
                })
            }

            await findCommentByIdAndDelete(commentId)
            res.json({
                success: 'Comment has been deleted successfully'
            })
        } catch (error) {
            handleError(error)
        }
    }
}

function findBlogById(id) {
    return new Promise((resolve, reject) => {
        Blog.findById(id, (error, result) => {
            if (error) {
                return reject(error)
            }

            resolve(result)
        })
    })
}

function findBlogByIdAndDelete(id) {
    return new Promise((resolve, reject) => {
        Blog.findByIdAndDelete(id, (error, result) => {
            if (error) {
                return reject(error)
            }

            resolve(result)
        })
    })
}

function findCommentById(id) {
    return new Promise((resolve, reject) => {
        Comment.findById(id, (error, result) => {
            if (error) {
                return reject(error)
            }

            resolve(result)
        })
    })
}

function findCommentByIdAndDelete(id) {
    return new Promise((resolve, reject) => {
        Comment.findByIdAndDelete(id, (error, result) => {
            if (error) {
                return reject(error)
            }

            resolve(result)
        })
    })
}

function findCommentsForBlog(id) {
    return new Promise((resolve, reject) => {
        Comment.find({ blog: id })
            .select('content')
            .sort({ createdAt: 1 })
            .exec((error, result) => {
                if (error) {
                    return reject(error)
                }

                resolve(result)
            })
    })
}
