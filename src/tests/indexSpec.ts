import supertest from 'supertest';
import app from '../index';

const request = supertest(app);
describe('Test endpoint responses', () => {
  it('gets the api endpoint 1', async () => {
    const response = await request.get('/convert').query({
      filename: 'fjord',
      width: '200',
      height: '200'
    }); //?filename=fjord&width=200&height=200');
    expect(response.status).toBe(200);
  });
  /*it('gets the api endpoint 2', async () => {
    const response = await request.get('/convert/?filename=ford&width=200&height=200');
    expect(response.status).toBe(404);
  });*/
});
