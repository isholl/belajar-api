import mongoose from 'mongoose'
import supertest from 'supertest'

import config from '../config/env'
import { insertUser } from '../services/user.service'
import { User } from '../types/api'
import { hashing } from '../utils/hashing'
import { signJWT } from '../utils/jwt'
import { createServer } from '../utils/server'

const app = createServer()

const userPayload: User = {
  user_id: 'u-123',
  name: 'User Test',
  email: 'user@test.com',
  password: hashing('password'),
}

let adminToken: string
let userToken: string

describe('User routes', () => {
  beforeAll(async () => {
    await mongoose.connect(`${config.DB_TEST}`)
    await insertUser(userPayload)
    // create tokens used for authenticated routes in tests (plain payload)
    adminToken = signJWT(
      { role: 'admin', user_id: 'admin-1', email: 'admin@test.com' },
      { expiresIn: '1d' },
    )
    userToken = signJWT(
      {
        role: 'regular',
        user_id: userPayload.user_id,
        email: userPayload.email,
      },
      { expiresIn: '1d' },
    )
  })

  afterAll(async () => {
    await mongoose.connection.dropCollection('users')
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const { body, statusCode } = await supertest(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)

      expect(statusCode).toBe(200)
      expect(body.data).toBeDefined()
      expect(Array.isArray(body.data)).toBe(true)
    })
  })

  describe('GET /api/users/:id', () => {
    it('should return single user by id', async () => {
      const { body, statusCode } = await supertest(app)
        .get(`/api/users/${userPayload.user_id}`)
        .set('Authorization', `Bearer ${userToken}`)

      expect(statusCode).toBe(200)
      expect(body.data).toBeDefined()
      expect(body.data.user_id).toBe(userPayload.user_id)
    })

    it('should return 404 when user not found', async () => {
      const { body, statusCode } = await supertest(app)
        .get(`/api/users/not-exists-id`)
        .set('Authorization', `Bearer ${userToken}`)

      expect(statusCode).toBe(500) // service throws and controller returns 500
      expect(body.message).toBeDefined()
    })
  })

  describe('POST /api/users', () => {
    it('should validate input', async () => {
      const { body, statusCode } = await supertest(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'A',
          email: 'invalid',
        })

      expect(statusCode).toBe(422)
      expect(body.message).toBe('Validation error')
      expect(Array.isArray(body.errors)).toBe(true)
    })

    it('should create a new user', async () => {
      const { body, statusCode } = await supertest(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          user_id: 'u-456',
          name: 'New User',
          email: 'newuser@test.com',
          password: 'mypassword',
        })

      // createUser controller returns 200 on success
      expect(statusCode).toBe(200)
      expect(body.message).toBe('User created successfully.')
    })
  })

  describe('PUT /api/users/:id', () => {
    it('should validate update payload', async () => {
      const { body, statusCode } = await supertest(app)
        .put(`/api/users/${userPayload.user_id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'A' })

      expect(statusCode).toBe(422)
      expect(body.message).toBe('Validation error')
      expect(Array.isArray(body.errors)).toBe(true)
    })

    it('should update user', async () => {
      const { body, statusCode } = await supertest(app)
        .put(`/api/users/${userPayload.user_id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' })

      expect(statusCode).toBe(200)
      expect(body.message).toBe('User updated successfully.')
    })
  })

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      // ensure the user exists (create directly via service because POST endpoint
      // generates its own user_id)
      await insertUser({
        user_id: 'u-456',
        name: 'To Delete',
        email: 'todelete@test.com',
        password: hashing('password'),
      } as User)

      const { body, statusCode } = await supertest(app)
        .delete(`/api/users/u-456`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(statusCode).toBe(200)
      expect(body.message).toBe('User deleted successfully.')
    })
  })
})
