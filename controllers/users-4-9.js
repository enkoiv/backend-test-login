const usersRouter = require('express').Router()
const User = require('../models/user-4-9')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  if (user) {response.json(user)}
  else {response.status(404).end()}
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  const username = body.username

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const hashedPassword = await bcrypt
    .hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: hashedPassword
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter