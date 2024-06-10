import app from './index.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createTestUser } from './helper/testUtil.js';

const mongoServer = new MongoMemoryServer();

beforeAll(async () => {
    await mongoServer.start();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create test users
    await createTestUser('admin', 'adminpassword', 'admin');
    await createTestUser('user', 'userpassword', 'user');
});

let userId;
let adminToken;

describe('Test client API', () => {

    test('Admin login và lấy token', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'admin', password: 'adminpassword' });
        console.log(response.headers['set-cookie']);
        adminToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
        console.log(adminToken);    
        expect(response.statusCode).toBe(200);
    });

    test('User login và lấy token', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'user', password: 'userpassword' });
        expect(response.statusCode).toBe(200);
    });

    test('Tạo 1 bản ghi mới với admin', async () => {
        const newUser = {
            name: 'Test User',
            gender: 'male',
            school: 'Test School'
        };
        const response = await request(app)
            .post('/user/post')
            .set('Cookie', `token=${adminToken}`)
            .send(newUser);
        userId = response.body.newUser._id;
        expect(response.statusCode).toBe(201);
        expect(response.body.newUser.name).toBe(newUser.name);
        expect(response.body.newUser.gender).toBe(newUser.gender);
        expect(response.body.newUser.school).toBe(newUser.school);
    });

    test('Lấy tất cả bản ghi', async () => {
        const response = await request(app)
            .get('/user/get')
            .set('Cookie', `token=${adminToken}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    test('Lấy 1 bản ghi', async () => {
        const id = userId;
        const response = await request(app)
            .get(`/user/get/${id}`)
            .set('Cookie', `token=${adminToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(id);
    });

    test('Sửa 1 bản ghi với admin', async () => {
        const updatedUser = {
            _id: userId,
            name: 'Updated User',
            gender: 'female',
            school: 'Updated School'
        };
        const response = await request(app)
            .post('/user/post')
            .set('Cookie', `token=${adminToken}`)
            .send(updatedUser);
        expect(response.statusCode).toBe(200);
        expect(response.body.updatedUser.name).toBe(updatedUser.name);
        expect(response.body.updatedUser.gender).toBe(updatedUser.gender);
        expect(response.body.updatedUser.school).toBe(updatedUser.school);
    });

    test('Xóa 1 bản ghi với admin', async () => {
        const id = userId;
        const response = await request(app)
            .delete(`/user/${id}`)
            .set('Cookie', `token=${adminToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Student deleted successfully');
    });

    test('Người dùng thường không thể tạo 1 bản ghi mới', async () => {
        const newUser = {
            name: 'Test User 2',
            gender: 'male',
            school: 'Test School 2'
        };
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ username: 'user', password: 'userpassword' });
        const userToken = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

        const response = await request(app)
            .post('/user/post')
            .set('Cookie', `token=${userToken}`)
            .send(newUser);
        expect(response.statusCode).toBe(403);
    });

    test('Người dùng thường không thể xóa 1 bản ghi', async () => {
        const id = userId;
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ username: 'user', password: 'userpassword' });
        const userToken = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

        const response = await request(app)
            .delete(`/user/${id}`)
            .set('Cookie', `token=${userToken}`);
        expect(response.statusCode).toBe(403);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});
