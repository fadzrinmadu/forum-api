const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyLikedComment function', () => {
    it('should return true when comment is liked', async () => {
      // Arrange
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const likeId = 'like-123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);
      await LikesTableTestHelper.addLikeComment({ id: likeId, owner, commentId });

      // Action
      const likedComment = await likeRepositoryPostgres.verifyLikedComment(commentId, owner);

      // Assert
      expect(likedComment).toEqual(true);
    });

    it('should return false when comment is not liked', async () => {
      // Arrange
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const likeId = 'like-123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);

      // Action
      const likedComment = await likeRepositoryPostgres.verifyLikedComment(commentId, owner);

      // Assert
      expect(likedComment).toEqual(false);
    });
  });

  describe('addLikeByCommentId function', () => {
    it('should persist add like comment', async () => {
      // Arrange
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const likeId = 'like-123';

      const fakeIdGenerator = () => '123'; // stub
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);

      // Action
      await likeRepositoryPostgres.addLikeByCommentId(commentId, owner);

      // Assert
      const likes = await LikesTableTestHelper.findLikesById('like-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLikeByCommentId function', () => {
    it('should persist delete like comment', async () => {
      // Arrange
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const likeId = 'like-123';

      const fakeIdGenerator = () => '123'; // stub
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addCommentByThreadId({ id: commentId }, owner, threadId);
      await LikesTableTestHelper.addLikeComment({ id: likeId, owner, commentId });

      // Action
      await likeRepositoryPostgres.deleteLikeByCommentId(commentId, owner);

      // Assert
      const likes = await LikesTableTestHelper.findLikesById('like-123');
      expect(likes).toHaveLength(0);
    });
  });
});
