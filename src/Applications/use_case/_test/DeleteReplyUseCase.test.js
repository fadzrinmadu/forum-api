const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 123,
      owner: 123,
      threadId: 123,
      replyId: 123,
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      owner: 'user-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith(useCasePayload.threadId);

    expect(mockCommentRepository.getCommentById)
      .toBeCalledWith(useCasePayload.commentId);

    expect(mockReplyRepository.verifyReplyOwner)
      .toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);

    expect(mockReplyRepository.deleteReplyById)
      .toBeCalledWith(useCasePayload.replyId);
  });
});
