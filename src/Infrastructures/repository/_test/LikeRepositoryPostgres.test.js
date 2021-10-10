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

  describe('getLikeByCommentIds function', () => {
    it('should return like by comment ids', async () => {
      const owners = ['user-123', 'user-124'];
      const threadId = 'thread-123';
      const commentIds = ['comment-123', 'comment-124'];
      const likeIds = ['like-123', 'like-124', 'like-125'];

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owners[0], username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: owners[1], username: 'aan' });
      await ThreadsTableTestHelper.addThread({ id: threadId });

      await CommentsTableTestHelper
        .addCommentByThreadId({ id: commentIds[0] }, owners[0], threadId);
      await CommentsTableTestHelper
        .addCommentByThreadId({ id: commentIds[1] }, owners[1], threadId);

      await LikesTableTestHelper.addLikeComment({
        id: likeIds[0],
        owner: owners[0],
        commentId: commentIds[0],
      });

      await LikesTableTestHelper.addLikeComment({
        id: likeIds[1],
        owner: owners[1],
        commentId: commentIds[0],
      });

      await LikesTableTestHelper.addLikeComment({
        id: likeIds[2],
        owner: owners[0],
        commentId: commentIds[1],
      });

      // Action
      const likes = await likeRepositoryPostgres.getLikeByCommentIds(commentIds);

      // Assert
      expect(likes).toHaveLength(3);
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
