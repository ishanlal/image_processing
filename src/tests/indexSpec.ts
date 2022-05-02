import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('Test endpoint responses', () => {
  it('gets the image conversion endpoint with correct query', async () => {
    const response = await request.get('/convert/').query({
      filename: 'fjord',
      width: '200',
      height: '200'
    });
    expect(response.status).toBe(200);
  });
  it('gets the image conversion endpoint with incorrect query', async () => {
    const response = await request.get('/convert/').query({
      filename: 'ford',
      width: '300',
      height: '300'
    });
    expect(response.status).toBe(404);
  });
});
