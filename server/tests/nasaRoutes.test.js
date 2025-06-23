const request = require('supertest');

const app = require('../server');

const axios = require('axios');


jest.mock('axios');

beforeEach(() => { jest.clearAllMocks(); });


describe('Get EPIC', () => {

	it('fail: No images found for this date', async () => {
		axios.get.mockResolvedValue({ data: [] });
		const res = await request(app).get('/api/nasa/epic');
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toMatch(/no images found/i);
	});

	it('fail: The API is not responding or the request limit has been reached', async () => {
		axios.get.mockRejectedValue({ response: { status: 429 } });
		const res = await request(app).get('/api/nasa/epic');
		expect(res.statusCode).toBe(429);
		expect(res.body.message).toMatch(/request limit/i);
	});

	it('success: Images received', async () => {
		axios.get.mockResolvedValue({
			data: [
				{
					identifier: '1',
					caption: 'Test caption',
					date: '2025-06-22 12:00:00',
					image: 'test-image-1.jpg'
				}
			]
		});
		const res = await request(app).get('/api/nasa/epic');
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveLength(1);
		expect(res.body[0]).toHaveProperty('id', '1');
		expect(res.body[0]).toHaveProperty('caption', 'Test caption');
		expect(res.body[0]).toHaveProperty('image');
		expect(res.body[0].image).toMatch(/^https:\/\/epic.gsfc.nasa.gov\/archive/);
	});

});


describe('Get Latest Date (EPIC)', () => {

	it('fail: No available dates found from NASA EPIC', async () => {
		axios.get.mockResolvedValue({ data: [] });
		const res = await request(app).get('/api/nasa/epic/latest-date');
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toMatch(/no available dates found/i);
	});

	it('fail: Failed to fetch EPIC available dates', async () => {
		axios.get.mockRejectedValue(new Error('Network Error'));
		const res = await request(app).get('/api/nasa/epic/latest-date');
		expect(res.statusCode).toBe(500);
		expect(res.body.message).toMatch(/failed to fetch/i);
	});

	it('success: Latest Date received', async () => {
		const mockData = [
			{ date: '2025-06-22', image: 'test-image-1.jpg' },
			{ date: '2025-06-21', image: 'test-image-2.jpg' }
		];
		axios.get.mockResolvedValue({ data: mockData });
		const res = await request(app).get('/api/nasa/epic/latest-date');
		expect(res.statusCode).toBe(200);
		expect(res.body.latestDate).toEqual(mockData[0]);
		expect(axios.get).toHaveBeenCalledWith(
			expect.stringContaining('https://api.nasa.gov/EPIC/api/natural/all')
		);
	});

});


describe('Get APOD', () => {

	it('fail: The API is not responding or the request limit has been reached', async () => {
		axios.get.mockRejectedValue({ response: { status: 429 } });
		const res = await request(app).get('/api/nasa/apod');
		expect(res.statusCode).toBe(429);
		expect(res.body.message).toMatch(/request limit/i);
	});

	it('success: Image received', async () => {
		const mockData = {
			image: 'test-image-1.jpg',
			date: '2025-06-23'
		};
		axios.get.mockResolvedValue({ data: mockData });
		const res = await request(app).get('/api/nasa/apod');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(mockData);
		expect(axios.get).toHaveBeenCalledWith(
			expect.stringContaining('https://api.nasa.gov/planetary/apod')
		);
	});

	it('success: Previous image received', async () => {
		const daysAgo = 1;
		const targetDate = new Date();
		targetDate.setDate(targetDate.getDate() - daysAgo);
		const dateStr = targetDate.toISOString().split('T')[0];
		const mockData = {
			image: 'test-image-2.jpg',
			date: dateStr
		};
		axios.get.mockResolvedValue({ data: mockData });
		const res = await request(app).get(`/api/nasa/apod?daysAgo=${daysAgo}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(mockData);
		expect(axios.get).toHaveBeenCalledWith(
			expect.stringContaining(`date=${dateStr}`)
		);
	});

});


describe('Get Rover', () => {

	it('fail: The API is not responding or the request limit has been reached', async () => {
		axios.get.mockRejectedValue({ response: { status: 429 } });
		const res = await request(app).get('/api/nasa/rovers');
		expect(res.statusCode).toBe(429);
		expect(res.body.message).toMatch(/request limit/i);
	});

	it('success: Image by sol received', async () => {
		const sol = 1;
		const mockData = [
			{ id: 1, img_src: 'test-image-1.jpg' },
			{ id: 2, img_src: 'test-image-2.jpg' }
		];
		axios.get.mockResolvedValueOnce({ data: { photos: mockData } });
		const res = await request(app).get(`/api/nasa/rovers?sol=${sol}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(mockData);
		expect(axios.get).toHaveBeenCalledWith(
			expect.stringContaining('mars-photos/api/v1/rovers/curiosity/photos'),
			expect.objectContaining({
				params: expect.objectContaining({
					api_key: expect.any(String),
					sol: String(sol)
				})
			})
		);
	});

	it('success: Image without sol received', async () => {
		const maxSol = 100;
		const mockData = [
			{ id: 1, img_src: 'test-image-1.jpg' }
		];
		axios.get.mockResolvedValueOnce({ data: { rover: { max_sol: maxSol } } }).mockResolvedValueOnce({ data: { photos: mockData } });
		const res = await request(app).get('/api/nasa/rovers');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(mockData);
		expect(axios.get).toHaveBeenNthCalledWith(2,
			expect.stringContaining('mars-photos/api/v1/rovers/curiosity/photos'),
			expect.objectContaining({
				params: expect.objectContaining({
					api_key: expect.any(String),
					sol: maxSol
				})
			})
		);
	});

});


describe('GET Max Sol (Rover)', () => {

  it('fail: Could not retrieve max_sol from NASA API', async () => {
    axios.get.mockResolvedValueOnce({ data: { rover: {} } });
    const res = await request(app).get('/api/nasa/rovers/max-sol');
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/not retrieve max_sol/i);
  });

	  it('success: Max Sol received', async () => {
    const mockSol = 1;
    axios.get.mockResolvedValueOnce({ data: { rover: { max_sol: mockSol } } });
    const res = await request(app).get('/api/nasa/rovers/max-sol');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ max_sol: mockSol });
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('mars-photos/api/v1/rovers/curiosity'),
    );
  });

});