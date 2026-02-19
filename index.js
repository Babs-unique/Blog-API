const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const authDbConnection = require('./src/config/db');
require('dotenv').config();




const app = express();



const userRoutes = require('./src/routes/user.routes');
const blogRoutes = require('./src/routes/blog.routes');
const errorHandler = require('./src/middleware/errorHandler');
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(morgan('dev'));


authDbConnection();




app.get('/',(req,res)=>{
    res.send("Welcome to Blog API");
});


app.use('/api/auth',userRoutes);
app.use('/api/posts',blogRoutes);


app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});
