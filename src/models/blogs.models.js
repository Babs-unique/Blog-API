const mongoose = require('mongoose');





const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    author:{
        ref:'user',
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        enum:["draft","published"],
        default:"draft",
    },
    tags:{
        type:[String],
        default:[],
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },
    deletedAt:{
        type:Date,
        default:null,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    }
},
    {
        timestamps:true,
        versionKey:false,
    }
);


const Blog = mongoose.model('blog',blogSchema);

module.exports = Blog;