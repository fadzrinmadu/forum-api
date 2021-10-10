const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    // Action & Assert
    await expect(getDetailThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
    };

    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    // Action & Assert
    await expect(getDetailThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating GetDetailThreadUseCase correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const replies = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: 'date',
        content: 'content',
      },
    ];

    const comments = [
      {
        id: commentId,
        username: 'aan',
        date: 'date',
        content: 'content',
        likeCount: 2,
        replies,
      },
    ];

    const expectedDetailThread = {
      id: threadId,
      title: 'title',
      body: 'body',
      date: 'date',
      username: 'fadzrin',
      comments,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetailThread));

    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));

    mockReplyRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(replies));

    mockLikeRepository.getLikeCountByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(2));

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute({ threadId });

    // Assert
    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
  });
});
