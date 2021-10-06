const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'payload content',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.addCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addCommentByThreadId).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
    }));
  });
});
