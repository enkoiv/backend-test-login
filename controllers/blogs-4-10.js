const blogsRouter = require('express').Router()
const Blog = require('../models/blog-4-10')
const User = require('../models/user-4-10')

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
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({})

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

module.exports = blogsRouter