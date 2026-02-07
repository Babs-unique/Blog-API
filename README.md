# Blog API 📝

A straightforward backend API for managing a blogging platform. This project lets you create, read, and manage blog posts with user authentication and authorization. Think of it as the backbone that powers a blogging application.

## What Does This Do?

This is a RESTful API built with Express.js and MongoDB that handles:

- **User Management**: Register new users and authenticate them with JWT tokens
- **Blog Creation**: Write and publish blog posts with automatic URL-friendly slugs
- **Blog Discovery**: Browse published blogs with pagination support
- **Content Management**: Update your own posts and soft-delete them (keeping the data but marking as deleted)

It's secured with JSON Web Tokens (JWT) so only authenticated users can create or modify their own content.

## Tech Stack

- **Node.js + Express.js** - The web framework
- **MongoDB + Mongoose** - Database and data modeling
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing for security
- **Slugify** - Creates URL-friendly blog titles

## Getting Started Locally

### Prerequisites

Make sure you have these installed:
- Node.js (v14 or higher)
- MongoDB (local instance or MongoDB Atlas account)
- npm or yarn

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd "Backend Development/Blog API"
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` and add your actual values:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blog-api
JWT_SECRET=your-super-secret-key-here-make-it-long-and-random
NODE_ENV=development
```

**What these mean:**
- `PORT`: What port your server runs on (default: 3000)
- `MONGODB_URI`: Your MongoDB connection string (local or cloud)
- `JWT_SECRET`: A random string used to sign authentication tokens (make it long and unique!)
- `NODE_ENV`: Whether you're developing or in production

### 3. Start the Server

```bash
npm run dev
```

You should see:
```
Server is running on port 3000
Connected to Database successfully
```

Great! Your API is now live at `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /
```
Quick way to verify the server is running.

---

### User Authentication

#### Register a New User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully"
}
```

**Error Response (400):**
```json
{
  "message": "User already exists with this email"
}
```

---

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "Message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Save this token! You'll need it for creating and managing blogs. It expires in 1 hour.

---

### Blog Management

#### Create a New Blog Post
```
POST /api/posts/create
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Getting Started with Node.js",
  "content": "Node.js is a JavaScript runtime built on Chrome's V8 engine...",
  "tags": ["nodejs", "javascript", "backend"]
}
```

**Success Response (201):**
```json
{
  "message": "Blog created successfully",
  "blog": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Getting Started with Node.js",
    "content": "Node.js is a JavaScript runtime...",
    "slug": "getting-started-with-nodejs",
    "author": "507f1f77bcf86cd799439010",
    "tags": ["nodejs", "javascript", "backend"],
    "status": "draft",
    "createdAt": "2025-02-07T10:30:00Z"
  }
}
```

**What's happening?**
- The title is automatically converted to a slug (URL-friendly format)
- Your blog starts as a "draft" (not visible to everyone yet)
- The system records when it was created

---

#### Get All Published Blogs
```
GET /api/posts?page=1&limit=10
```

**Parameters:**
- `page` - Which page of results (default: 1)
- `limit` - How many posts per page (default: 10)

**Success Response (200):**
```json
{
  "totalItems": 42,
  "totalPages": 5,
  "currentPage": 1,
  "limit": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Getting Started with Node.js",
      "slug": "getting-started-with-nodejs",
      "content": "Node.js is a JavaScript runtime...",
      "author": "507f1f77bcf86cd799439010",
      "tags": ["nodejs", "javascript", "backend"],
      "status": "published",
      "createdAt": "2025-02-07T10:30:00Z"
    },
    // ... more posts
  ]
}
```

---

#### Get a Specific Blog by Slug
```
GET /api/posts/:slug
```

Example:
```
GET /api/posts/getting-started-with-nodejs
```

**Success Response (200):**
```json
{
  "message": "Blog with slug found",
  "blog": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Getting Started with Node.js",
    "slug": "getting-started-with-nodejs",
    "content": "Node.js is a JavaScript runtime...",
    "author": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "tags": ["nodejs", "javascript", "backend"],
    "status": "published",
    "createdAt": "2025-02-07T10:30:00Z"
  }
}
```

---

#### Update Your Blog Post
```
PATCH /api/posts/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Updated: Getting Started with Node.js",
  "content": "Updated content goes here...",
  "tags": ["nodejs", "javascript", "backend", "updated"]
}
```

**Success Response (200):**
```json
{
  "message": "Blog updated successfully",
  "blog": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated: Getting Started with Node.js",
    "content": "Updated content goes here...",
    "slug": "getting-started-with-nodejs",
    // ... rest of the blog object
  }
}
```

**Error Response (403):**
```json
{
  "message": "Unauthorized to update this blog"
}
```

You can only update your own posts!

---

#### Delete a Blog Post (Soft Delete)
```
DELETE /api/posts/:id
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "message": "Blog soft deleted successfully",
  "blog": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Getting Started with Node.js",
    "isDeleted": true,
    "deletedAt": "2025-02-07T11:30:00Z",
    // ... rest of the blog object
  }
}
```

**What's a soft delete?**
The blog isn't actually removed from the database—it's just marked as deleted. This is good for data recovery and keeping analytics intact.

---

## Using cURL for Testing

If you prefer the command line, here are some quick examples:

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "myPassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "myPassword123"
  }'
```

Save the token from the response, then use it for the next request.

### Create a Blog (with token)
```bash
curl -X POST http://localhost:3000/api/posts/create \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my blog post.",
    "tags": ["first", "blogging"]
  }'
```

### Get All Published Blogs
```bash
curl http://localhost:3000/api/posts?page=1&limit=5
```

### Get a Blog by Slug
```bash
curl http://localhost:3000/api/posts/my-first-blog-post
```

---

## Environment Variables Explained

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `PORT` | Yes | `3000` | The port where your server listens |
| `MONGODB_URI` | Yes | `mongodb://localhost:27017/blog-api` | Database connection string |
| `JWT_SECRET` | Yes | `your-very-long-random-secret-string` | Key for signing auth tokens |
| `NODE_ENV` | No | `development` | Current environment (for logging/error handling) |

### Finding Your MongoDB URI

**Local MongoDB:**
```
mongodb://localhost:27017/blog-api
```

**MongoDB Atlas (Cloud):**
```
mongodb+srv://username:password@cluster0.mongodb.net/blog-api?retryWrites=true&w=majority
```

---

## Project Structure

```
Blog API/
├── index.js                    # Main server entry point
├── package.json               # Dependencies and scripts
├── .env.example               # Template for environment variables
├── .env                       # Your actual env config (git ignored)
├── README.md                  # This file!
└── src/
    ├── config/
    │   ├── auth.js           # JWT authentication middleware
    │   └── db.js             # MongoDB connection setup
    ├── controllers/
    │   ├── users.controller.js    # User registration & login logic
    │   └── blog.controller.js     # Blog CRUD operations
    ├── models/
    │   ├── users.models.js        # User database schema
    │   └── blogs.models.js        # Blog database schema
    └── routes/
        ├── user.routes.js        # User API endpoints
        └── blog.routes.js        # Blog API endpoints
```

---

## Common Issues & Fixes

### "Cannot POST /api/posts/create"
**Cause:** The authentication middleware isn't finding your JWT token.

**Fix:** Make sure you're including the token in your request header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### "Database connection error"
**Cause:** MongoDB isn't running or your connection string is wrong.

**Fix:** 
- Check MongoDB is running: `mongod` (local) or verify your MongoDB Atlas connection string
- Verify `MONGODB_URI` in your `.env` file

### "User already exists with this email"
**Cause:** That email is already registered.

**Fix:** Use a different email or login with existing credentials.

### "Blog not found with this slug"
**Cause:** The blog is either not published, doesn't exist, or you typed the slug wrong.

**Fix:** Check the exact slug and make sure the blog's status is "published".

---

## Development Tips

- **Token Expiration:** Tokens expire after 1 hour. You'll need to login again to get a new one.
- **Slugs:** The title "My Amazing Blog Post!" becomes "my-amazing-blog-post"
- **Testing:** Use Postman or cURL to test endpoints before building a frontend
- **Passwords:** Always use strong, unique passwords in production
- **CORS:** If building a frontend, you may need to add CORS configuration to `index.js`

---

## Contributing

Found a bug? Have an improvement? Feel free to fork this repo and submit a pull request!

---

## License

ISC License - Feel free to use this project however you'd like.

---

**Questions?** Check the code comments or open an issue on GitHub!

Happy blogging! ✍️
