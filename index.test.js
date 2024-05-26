import app from './index.js';
import request from 'supertest';
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const mongoServer = new MongoMemoryServer();

beforeAll(async () => {
    await mongoServer.start();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
 });

let userId;

describe('Test client API', () => {

    test('Tạo 1 bản ghi mới', async () => {
        const newUser = {
            name: 'Test User',
            gender: 'male',
            school: 'Test School'
        };
        const response = await request(app).post('/user/post').send(newUser);
        userId = response.body.newUser._id;
        expect(response.statusCode).toBe(201);
        expect(response.body.newUser.name).toBe(newUser.name);
        expect(response.body.newUser.gender).toBe(newUser.gender);
        expect(response.body.newUser.school).toBe(newUser.school);
    });

    test('Lấy tất cả bản ghi', async () => {
        const response = await request(app).get('/user/get');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    test('Lấy 1 bản ghi', async () => {
        const id = userId;
        const response = await request(app).get(`/user/get/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(id);
    });


    test('Sửa 1 bản ghi', async () => {
        const updatedUser = {
            _id: userId,
            name: 'Updated User',
            gender: 'female',
            school: 'Updated School'
        };
        const response = await request(app).post('/user/post').send(updatedUser);
        expect(response.statusCode).toBe(200);
        expect(response.body.updatedUser.name).toBe(updatedUser.name);
        expect(response.body.updatedUser.gender).toBe(updatedUser.gender);
        expect(response.body.updatedUser.school).toBe(updatedUser.school);
    });

    test('Xóa 1 bản ghi', async () => {
        const id = userId;
        const response = await request(app).delete(`/user/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});