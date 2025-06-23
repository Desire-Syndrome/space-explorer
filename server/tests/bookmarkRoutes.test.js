const request = require('supertest');

const app = require('../server.js');

const User = require('../models/User');

const { connect, closeDatabase, clearDatabase } = require('./setup');


beforeAll(connect);
afterAll(closeDatabase);
afterEach(clearDatabase);


describe('Add Bookmark', () => {
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
		const res = await request(app).post('/api/bookmarks');
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toMatch(/not authorized/i);
	});

	it('fail: Missing type or data', async () => {
		const res = await request(app).post('/api/bookmarks').set('Authorization', `Bearer ${token}`).send({});
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toMatch(/missing type or data/i);
	});

	it('fail: This bookmark already exists', async () => {
		await request(app).post('/api/bookmarks').set('Authorization', `Bearer ${token}`).send({
			type: 'epic',
			data: { id: '1234', title: 'Title' },
		});
		const res = await request(app).post('/api/bookmarks').set('Authorization', `Bearer ${token}`).send({
			type: 'epic',
			data: { id: '1234', title: 'Title' },
		});

		expect(res.statusCode).toBe(409);
		expect(res.body.message).toMatch(/already exists/i);
	});

	it('success: Bookmark added', async () => {
		const res = await request(app).post('/api/bookmarks').set('Authorization', `Bearer ${token}`).send({
			type: 'epic',
			data: { id: '1234', title: 'Title' },
		});
		expect(res.statusCode).toBe(201);
		expect(res.body.bookmarks.length).toBe(1);
		expect(res.body.bookmarks[0].type).toBe('epic');
		expect(res.body.bookmarks[0].data.title).toBe('Title');
	});

});


describe('Get Bookmarks', () => {
	let token;
	let user;
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
		user = await User.findOne({ email: 'test-user@gmail.com' });
		user.bookmarks.push({
			type: 'epic',
			data: { id: '1234', title: 'Title' }
		});
		await user.save();
	});

	it('fail: User not authorized', async () => {
		const res = await request(app).get('/api/bookmarks');
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toMatch(/not authorized/i);
	});

	it('success: Bookmarks received', async () => {
		const res = await request(app).get('/api/bookmarks').set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.bookmarks).toBeInstanceOf(Array);
		expect(res.body.bookmarks.length).toBe(1);
		expect(res.body.bookmarks[0]).toMatchObject({
			type: 'epic',
			data: { id: '1234', title: 'Title' }
		});
	});

});


describe('Delete Bookmark', () => {
	let token;
	let user;
	const bookmark = {
		type: 'epic',
		data: { id: 'abc123', title: 'Title' }
	};
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
		user = await User.findOne({ email: 'test-user@gmail.com' });
		user.bookmarks.push(bookmark);
		await user.save();
	});

	it('fail: User not authorized', async () => {
		const res = await request(app).delete('/api/bookmarks/fake-id');
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toMatch(/not authorized/i);
	});

	it('fail: Bookmark not found', async () => {
		const res = await request(app).delete(`/api/bookmarks/fake-id`).set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toMatch(/not found/i);
	});

	it('success: Bookmark deleted', async () => {
		const res = await request(app).delete(`/api/bookmarks/${bookmark.data.id}`).set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.bookmarks.length).toBe(0);
	});

});