const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const likeCommentUseCase = new LikeCommentUseCase({});

    // Action & Assert
    await expect(likeCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      owner: 123,
      threadId: 123,
      commentId: 123,
    };
    const likeCommentUseCase = new LikeCommentUseCase({});

    // Action & Assert
    await expect(likeCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockLikeRepository.verifyLikedComment = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    mockLikeRepository.addLikeByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread)
      .toBeCalledWith(useCasePayload.threadId);

    expect(mockCommentRepository.verifyAvailableComment)
      .toBeCalledWith(useCasePayload.commentId);

    expect(mockLikeRepository.verifyLikedComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);

    expect(mockLikeRepository.addLikeByCommentId)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });

  it('should orchestrating the unlike comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockLikeRepository.verifyLikedComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    mockLikeRepository.deleteLikeByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread)
      .toBeCalledWith(useCasePayload.threadId);

    expect(mockCommentRepository.verifyAvailableComment)
      .toBeCalledWith(useCasePayload.commentId);

    expect(mockLikeRepository.verifyLikedComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);

    expect(mockLikeRepository.deleteLikeByCommentId)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });
});
