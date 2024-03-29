const request = require('supertest');
const app = require('../app.js');
const connection = require('../db/connection.js');

const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index')

beforeEach(() => seed(data));
afterAll(() => connection.end());


describe('DELETE /api/comments/:comment_id', () => {
  test('status:204, responds with an empty response body', () => {
    return request(app).delete('/api/comments/18').expect(204);
  });
});
    
describe("POST /api/articles/:article_id/comments", () => {
  it('status:201, responds with a comment created on an article', () => {
    const newComment = {
      author: 'icellusedkars',
      body: 'The quick brown fox jumps over the lazy dog.'
    };
    return request(app)
      .post('/api/articles/2/comments')
      .send(newComment)
      .expect(201)
      .then(({ body: { comment }}) => {
          expect(comment).toEqual(expect.objectContaining({
            article_id: expect.any(Number),
            comment_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
      }));
    });
  });
  it('status 400: comment not created - username missing', () => {
    const badComment = {
      // no username / author
      body: 'The quick brown fox jumps over the lazy dog.'
    };
    return request(app)
      .post('/api/articles/2/comments')
      .send(badComment)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe('bad request') // would prefer 'comment not created!'
      }); // can do that with a Promise.reject in model... a refactor for later!
  });
  it('status 400: comment not created - username passed but incorrect', () => {
    const badUsername = {
      author: 'icellusedkarzzz',
      body: 'The quick brown fox jumps over the lazy dog.'
    };
    return request(app)
      .post('/api/articles/2/comments')
      .send(badUsername)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe('bad request')
      }); 
  });
  it('status 400: comment not created - POST /api/articles/9999/comments - article_id does not exist', () => {
    const comment = {
      author: 'icellusedkars',
      body: 'The quick brown fox jumps over the lazy dog.'
    };
    return request(app)
      .post('/api/articles/9999/comments')
      .send(comment)
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe('bad request');
      }); 
  });
  it("status 400: returns 'bad request' when passed 'not-a-valid-id' as id", () => {
    return request(app)
      .get('/api/articles/not-a-valid-id/comments')
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("bad request");
      });
  });
});

