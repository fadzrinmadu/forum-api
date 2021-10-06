const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError error when comment is not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);

      // Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(commentId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('addCommentByThreadId function', () => {
    it('should persist add comment', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';

      const newComment = {
        content: 'payload content',
        owner,
        threadId,
      };

      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });

      // Action
      await commentRepositoryPostgres.addCommentByThreadId(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });
  });

  describe('getCommentById function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentById('comment-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);

      // Assert
      await expect(commentRepositoryPostgres.getCommentById(commentId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return comments by thread id', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);

      // Action
      const comment = await commentRepositoryPostgres.getCommentByThreadId(threadId);

      // Assert
      expect(comment).toHaveLength(1);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw error when comment is not exists', async () => {
      // Arrange
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById(commentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should persist delete comment', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'comment-123';
      const newComment = {
        content: 'payload content',
      };

      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById(commentId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw error when comment is not exists', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'comment-123';

      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-321', owner))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw error when user has no access to delete comment', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'comment-123';

      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'user-321'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should persist verify comment owner', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'comment-123';

      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, owner))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });
});
