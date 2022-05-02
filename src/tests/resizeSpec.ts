import supertest from 'supertest';
import resize from '../resize';

const request = supertest(resize);

describe('Resizing test...', () => {
  it('test image transforming function with correct inputs', async () => {
    expect(async () => {
      await resize('santamonica.jpg', 'santamonica_250_250.jpg', 250, 250);
    }).not.toThrow();
  });
});
