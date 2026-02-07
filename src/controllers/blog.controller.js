const Blog = require('../models/blogs.models');
const User = require('../models/users.models');
const slugify = require('slugify');


const createBlog = async (req,res,next) => {
    const {title,content,tags} = req.body;
    if(!title || !content || !tags){
        res.status(400);
        throw new Error("Title, content and tags are required to create a blog");
    }
    try{
        const authorId = req.user.id;
        if(!authorId){
            res.status(401);
            throw new Error("Author ID is required to create a blog");
        }
        const slug = slugify(title,{lower:true,strict:true});

        const newBlog = new Blog({
            title,
            content,
            tags,
            slug,
            author: authorId,
        });
        await newBlog.save();
        return res.status(201).json({
            message:"Blog created successfully",
            blog:newBlog
        });
    }catch(error){
        next(error);
    }
}

const getBlogs = async (req,res,next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

  const skipIndex = (page - 1) * limit;

    try {
        const items = await Blog.find({status: "published"})        
        .sort({ createdAt: 1 })               
        .skip(skipIndex)                       
        .limit(limit)                         
        .exec();                              

        const totalItems = await Blog.countDocuments({status: "published"});
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            totalItems,                             
            totalPages,                             
            currentPage: page,                      
            limit: limit,                            
            data: items                              
        });
    }catch(error){
        next(error);
    }
}

const getBlogBySlug = async (req,res,next) => {
    const {slug} = req.params;
    if(!slug){
        res.status(400);
        throw new Error("Blog slug is required ");
    }
    try{
        const blog = await Blog.findOne({slug,status:"published"})
        if(!blog){
            res.status(404);
            throw new Error("Blog not found with this slug");
        }
        return res.status(200).json({message:"Blog with slug found",blog});

    }catch(error){
        next(error);
    }
}

const updateBlog = async (req,res,next) => {
    const {id} = req.params;
    if(!id){
        res.status(400);
        throw new Error("Blog ID is required to update a blog");
    }
    const {title,content,tags} = req.body;
    try{

        const blog = await Blog.findByIdAndUpdate(id,
            {title,content,tags},
            {new:true});
        if(!blog){
            res.status(404);
            throw new Error("Blog not found with this ID");
        }

        if(blog.author.toString() !== req.user.id){
            res.status(401);
            throw new Error("Unauthorized to update this blog");
        }
        return res.status(200).json({message:"Blog updated successfully",blog});

    }catch(error){
        next(error);
    }
}


const softDeleteBlog = async (req,res,next) => {
    const {id} = req.params;
    if(!id){
        res.status(400);
        throw new Error("Blog ID is required to delete a blog");
    }
    try{

        const blog = await Blog.findByIdAndUpdate(id, {}, {new:true});

        if(!blog){
            res.status(404);
            throw new Error("Blog not found with this ID");
        }
        if(blog.author.toString() !== req.user.id){
            res.status(401);
            throw new Error("Unauthorized to delete this blog");
        }
            blog.isDeleted = true;
            blog.deletedAt = Date.now();

        await blog.save();
        return res.status(200).json({message:"Blog soft deleted successfully",blog});
    }catch(error){
        next(error);
}
}


module.exports = {
    createBlog,
    getBlogs,
    getBlogBySlug,
    updateBlog,
    softDeleteBlog,
}