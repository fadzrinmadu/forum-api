const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted replies', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';
      const requestPayload = {
        content: 'payload content',
      };

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread({ id: threadId }, owner);
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete reply', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);
      await RepliesTableTestHelper.addReplyByCommentId({ id: replyId }, owner, commentId);

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        auth: {
          strategy: 'forum_api_jwt',
          credentials: {
            id: owner,
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
