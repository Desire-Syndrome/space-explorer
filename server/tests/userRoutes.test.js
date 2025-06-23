const request = require('supertest');

const app = require('../server.js');

const User = require('../models/User');

const { connect, closeDatabase, clearDatabase } = require('./setup');


beforeAll(connect);
afterAll(closeDatabase);
afterEach(clearDatabase);


describe('Register User', () => {

	it('fail: Missing details', async () => {
		const res = await request(app).post('/api/user/registration').send({});
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toMatch(/missing details/i);
	});

	it('fail: User already exists', async () => {
		await request(app).post('/api/user/registration').send({
			name: 'Test User',
			email: 'test-user@gmail.com',
			password: 'Password-1'
		});
		const res = await request(app).post('/api/user/registration').send({
			name: 'Test User',
			email: 'test-user@gmail.com',
			password: 'Password-1'
		});
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toMatch(/already exists/i);
	});

	it('fail: Password must be at least 6 characters long', async () => {
		const res = await request(app).post('/api/user/registration').send({
			name: 'Test User',
			email: 'test-user@gmail.com',
			password: 'wrong'
		});
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toMatch(/at least 6 characters/i);
	});

	it('fail: Password must contain at least one uppercase letter and one number', async () => {
		const res = await request(app).post('/api/user/registration').send({
			name: 'Test User',
			email: 'test-user@gmail.com',
			password: 'new-password'
		});
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toMatch(/at least one uppercase letter and one number/i);
	});

	it('success: User created', async () => {
		const res = await request(app).post('/api/user/registration').send({
			name: 'Test User',
			email: 'test-user@gmail.com',
			password: 'Password-1'
		});
		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('_id');
		expect(res.body.email).toBe('test-user@gmail.com');
	});

});


describe('Login User', () => {
	beforeEach(async () => {
		await request(app).post('/api/user/registration').send({
			name: 'Test User',
			email: 'test-user@gmail.com',
			password: 'Password-1'
		});
	});

	it('fail: User not found', async () => {
		const res = await request(app).post('/api/user/login').send({
			email: 'wrong-user@gmail.com',
			password: 'Password-1'
		});
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toMatch(/invalid email or password/i);
	});

	it('fail: Incorrect password', async () => {
		const res = await request(app).post('/api/user/login').send({
			email: 'test-user@gmail.com',
			password: 'wrong'
		});
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toMatch(/invalid email or password/i);
	});

	it('success: User logged in', async () => {
		const res = await request(app).post('/api/user/login').send({
			email: 'test-user@gmail.com',
			password: 'Password-1'
		});
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('token');
		expect(res.body.email).toBe('test-user@gmail.com');
		expect(res.body.message).toMatch(/logged in/i);
	});

});


describe('Update User', () => {
	let token;
	beforeEach(async () => {
		await request(app).post('/api/user/registration').send({
			name: 'Test User',
			email: 'test-user@gmail.com',
			password: 'Password-1'
		});
		const res = await request(app).post('/api/user/login').send({
			email: 'test-user@gmail.com',
			password: 'Password-1'
		});
		token = res.body.token;
	});

	it('fail: User not authorized', async () => {
		const res = await request(app).put('/api/user/profile');
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toMatch(/not authorized/i);
	});

	it('fail: Please provide old password', async () => {
		const res = await request(app).put('/api/user/profile').set('Authorization', `Bearer ${token}`).send({
			newPassword: 'New-Password-1'
		});
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toMatch(/provide old password/i);
	});

	it('fail: Password must be at least 6 characters long', async () => {
		const res = await request(app).put('/api/user/profile').set('Authorization', `Bearer ${token}`).send({
			oldPassword: 'Password-1',
			newPassword: 'wrong'
		});
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toMatch(/at least 6 characters/i);
	});

	it('fail: Password must contain at least one uppercase letter and one number', async () => {
		const res = await request(app).put('/api/user/profile').set('Authorization', `Bearer ${token}`).send({
			oldPassword: 'Password-1',
			newPassword: 'New-password'
		});
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toMatch(/at least one uppercase letter and one number/i);
	});

	it('fail: Old password is incorrect', async () => {
		const res = await request(app).put('/api/user/profile').set('Authorization', `Bearer ${token}`).send({
			oldPassword: 'Wrong-Password-1',
			newPassword: 'New-password-1'
		});
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toMatch(/old password is incorrect/i);
	});

	it('success: Updated name and email', async () => {
		const res = await request(app).put('/api/user/profile').set('Authorization', `Bearer ${token}`).send({
			name: 'Updated Test User',
			email: 'updated-test-user@gmail.com'
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.name).toBe('Updated Test User');
		expect(res.body.email).toBe('updated-test-user@gmail.com');
		expect(res.body).toHaveProperty('token');
	});

	it('success: Updated password', async () => {
		const res = await request(app).put('/api/user/profile').set('Authorization', `Bearer ${token}`).send({
			oldPassword: 'Password-1',
			newPassword: 'New-password-1'
		});
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('token');
		const loginRes = await request(app).post('/api/user/login').send({
			email: 'test-user@gmail.com',
			password: 'New-password-1'
		});
		expect(loginRes.statusCode).toBe(200);
		expect(loginRes.body).toHaveProperty('token');
	});

});


describe('Delete User', () => {
	let token;
	beforeEach(async () => {
		await request(app).post('/api/user/registration').send({
			name: 'Test User',
			email: 'test-user@gmail.com',
			password: 'Password-1'
		});
		const loginRes = await request(app).post('/api/user/login').send({
			email: 'test-user@gmail.com',
			password: 'Password-1'
		});
		token = loginRes.body.token;
	});

	it('fail: User not authorized', async () => {
		const res = await request(app).delete('/api/user/profile');
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toMatch(/not authorized/i);
	});

	it('success: User profile deleted', async () => {
		const res = await request(app).delete('/api/user/profile').set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toMatch(/profile deleted/i);
		const deletedUser = await User.findOne({ email: 'test-user@gmail.com' });
		expect(deletedUser).toBeNull();
	});
});