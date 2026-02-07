const blogRouter = require('express').Router();
const auth = require('../config/auth')
const {createBlog, getBlogs, getBlogBySlug, updateBlog, softDeleteBlog} = require('../controllers/blog.controller');


blogRouter.post('/', auth, createBlog);
blogRouter.get('/', getBlogs);
blogRouter.get('/:slug',getBlogBySlug); 
blogRouter.put('/:id',auth,updateBlog);
blogRouter.delete('/:id',auth,softDeleteBlog);



module.exports = blogRouter;