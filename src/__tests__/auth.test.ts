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
  user_id: '213',
  name: 'Test User',
  email: 'test@example.com',
  password: hashing('password'),
}

describe('Auth', () => {
  beforeAll(async () => {
    await mongoose.connect(`${config.DB_TEST}`)
    await insertUser(userPayload)
  })

  afterAll(async () => {
    await mongoose.connection.dropCollection('users')
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe('User regestration', () => {
    describe('given invalid input', () => {
      it('should validate all field', async () => {
        const { body, statusCode } = await supertest(app)
          .post('/api/auth/register')
          .send({
            name: 'T',
            email: 'invalid-email',
            // password: '213',
          })

        expect(statusCode).toBe(422)
        expect(body.message).toBe('Validation error.')
        expect(body.errors).toHaveLength(3)
        expect(body.errors).toEqual(
          expect.arrayContaining([
            expect.stringContaining('name'),
            expect.stringContaining('email'),
            expect.stringContaining('password'),
          ]),
        )
      })
    })

    describe('given valid input', () => {
      it('should create a new user', async () => {
        const { body, statusCode } = await supertest(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: 'test@me.com',
            password: '12345678',
          })

        expect(statusCode).toBe(201)
        expect(body.message).toBe('Register user successfully.')
      })
    })
  })

  describe('User Login', () => {
    describe('given invalid input', () => {
      it('should validate all field', async () => {
        const { body, statusCode } = await supertest(app)
          .post('/api/auth/login')
          .send({
            email: 'invalid-email',
            password: '213',
          })

        expect(statusCode).toBe(422)
        expect(body.message).toBe('Validation error.')
        expect(body.errors).toEqual(
          expect.arrayContaining([
            expect.stringContaining('email'),
            expect.stringContaining('password'),
          ]),
        )
      })
    })

    describe('given invalid credentials', () => {
      it('should return 422 for non-existing email', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: 'password',
          })

        expect(statusCode).toBe(422)
        expect(body.message).toBe('Invalid email or password.')
      })

      it('should return 401 for wrong password', async () => {
        const { body, statusCode } = await supertest(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword',
          })

        expect(statusCode).toBe(401)
        expect(body.message).toBe('Invalid email or password.')
      })
    })

    describe('given valid credentials', () => {
      it('should return access token and refresh token', async () => {
        const { body, statusCode } = await supertest(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'password',
          })

        expect(statusCode).toBe(200)
        expect(body.message).toBe('Login success.')
        expect(body.data).toHaveProperty('accessToken')
        expect(body.data).toHaveProperty('refreshToken')
      })
    })
  })

  describe('Refresh session', () => {
    describe('given invalid input', () => {
      it('should return 422 for validation error', async () => {
        const { body, statusCode } = await supertest(app)
          .post('/api/auth/refresh')
          .send({})

        expect(statusCode).toBe(422)
        expect(body.message).toBe('Validation error.')
        expect(body.errors).toHaveLength(1)
        expect(body.errors).toEqual(
          expect.arrayContaining([expect.stringContaining('refreshToken')]),
        )
      })
    })

    describe('given invalid refresh token', () => {
      it('should return 401 for expired token', async () => {
        const expiredToken = signJWT({ ...userPayload }, { expiresIn: '-1s' })

        const { body, statusCode } = await supertest(app)
          .post('/api/auth/refresh')
          .send({
            refreshToken: expiredToken,
          })

        expect(statusCode).toBe(401)
        expect(body.message).toBe('Token expired.')
      })

      it('should return 422 for invalid token', async () => {
        const { body, statusCode } = await supertest(app)
          .post('/api/auth/refresh')
          .send({
            refreshToken: 'invalid-token',
          })

        expect(statusCode).toBe(422)
        expect(body.message).toBe('Invalid token structure.')
      })
    })

    describe('given valid refresh token', () => {
      it('should return new access token', async () => {
        const loginResponse = await supertest(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'password',
          })

        const refreshToken = loginResponse.body.data.refreshToken

        const { body, statusCode } = await supertest(app)
          .post('/api/auth/refresh')
          .send({
            refreshToken,
          })

        expect(statusCode).toBe(200)
        expect(body.message).toBe('Refresh session successfully.')
        expect(body.data).toHaveProperty('accessToken')
      })
    })
  })
})
