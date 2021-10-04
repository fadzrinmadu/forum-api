const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReplyByCommentId function', () => {
    it('should persist add reply', async () => {
      // Arrange
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const newReply = {
        content: 'payload content',
        owner,
        threadId,
        commentId,
      };

      const fakeIdGenerator = () => '123'; // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);

      // Action
      await replyRepositoryPostgres.addReplyByCommentId(newReply);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });
  });

  describe('getReplyByCommentId function', () => {
    it('should return replies by comment id', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const owner = 'user-123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);
      await RepliesTableTestHelper.addReplyByCommentId({ id: replyId }, owner, commentId);

      // Action
      const reply = await replyRepositoryPostgres.getReplyByCommentId(commentId);

      // Assert
      expect(reply).toHaveLength(1);
    });
  });

  describe('deleteReplyById function', () => {
    it('should throw error when reply is not exists', async () => {
      // Arrange
      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReplyById(replyId))
        .rejects.toThrow(NotFoundError);
    });

    it('should persist delete reply', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123'; // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);
      await RepliesTableTestHelper.addReplyByCommentId({ id: replyId }, owner, commentId);

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReplyById(replyId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw error when reply is not exists', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123'; // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);
      await RepliesTableTestHelper.addReplyByCommentId({ id: replyId }, owner, commentId);

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-321', owner))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw error when user has no access to delete reply', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123'; // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);
      await RepliesTableTestHelper.addReplyByCommentId({ id: replyId }, owner, commentId);

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, 'user-321'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should persist verify reply owner', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123'; // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);
      await RepliesTableTestHelper.addReplyByCommentId({ id: replyId }, owner, commentId);

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, owner))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });
});
