const blogsRouter = require('express').Router()
const Blog = require('../models/blog-4-10')
const User = require('../models/user-4-10')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate('user')
  if (blog) {response.json(blog)}
  else {response.status(404).end()}
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const tokenDecoder = (token) => {
  if (!token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  
  try {
    return jwt.verify(token, process.env.SECRET)
  }
  catch (JsonWebTokenError) { 
    return response.status(401).json({ error: 'token missing or invalid' })
  }
}

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(tokenDecoder(getTokenFrom(request)))

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  
  try {user.blogs = user.blogs.concat(savedBlog.id)}
  catch(TypeError) {
  user.blogs = savedBlog.id }
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const user = await User.findById(tokenDecoder(getTokenFrom(request)))

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  const savedBlog = await Blog.findById(request.params.id).populate('user')
  response.status(201).json(savedBlog)

})

module.exports = blogsRouter