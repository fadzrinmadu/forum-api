const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError error when thread is not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });

      // Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread(threadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      // Arrange
      const owner = 'user-123';
      const newThread = new NewThread({
        title: 'payload title',
        body: 'payload body',
        owner,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: owner });

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should return thread when thread is available', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId });

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      await expect(threadRepositoryPostgres.getThreadById(threadId))
        .resolves.not.toThrow(NotFoundError);
      expect(thread).toHaveProperty('id');
      expect(thread).toHaveProperty('title');
      expect(thread).toHaveProperty('body');
      expect(thread).toHaveProperty('username');
      expect(thread).toHaveProperty('date');
    });
  });
});
