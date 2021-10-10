const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
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
    const threadId = 'thread-123';
    const thread = {
      id: threadId,
      title: 'payload title',
      body: 'payload body',
      date: 'payload date',
      username: 'aan',
    };

    const comments = [
      {
        id: 'comment-123',
        username: 'ain',
        date: 'payload date',
        content: 'payload content',
      },
      {
        id: 'comment-124',
        username: 'dicoding',
        date: 'payload date',
        content: 'payload content',
      },
    ];

    const commentIds = comments.map((comment) => comment.id);

    const replies = [
      {
        id: 'reply-123',
        content: 'paylaod content',
        comment_id: commentIds[0],
        date: 'payload date',
        username: 'ain',
      },
      {
        id: 'reply-124',
        content: 'paylaod content',
        comment_id: commentIds[0],
        date: 'payload date',
        username: 'ain',
      },
      {
        id: 'reply-125',
        content: 'paylaod content',
        comment_id: commentIds[1],
        date: 'payload date',
        username: 'ain',
      },
    ];

    const likes = [
      {
        id: 'like-123',
        comment_id: commentIds[0],
      },
      {
        id: 'like-124',
        comment_id: commentIds[0],
      },
      {
        id: 'like-125',
        comment_id: commentIds[1],
      },
    ];

    const expectedDetailThread = {
      ...thread,
      comments: [
        {
          ...comments[0],
          likeCount: 2,
          replies: [
            new DetailReply(replies[0]),
            new DetailReply(replies[1]),
          ],
        },
        {
          ...comments[1],
          likeCount: 1,
          replies: [
            new DetailReply(replies[2]),
          ],
        },
      ],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));

    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));

    mockReplyRepository.getReplyByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve(replies));

    mockLikeRepository.getLikeByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve(likes));

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
    expect(mockReplyRepository.getReplyByCommentIds).toBeCalledWith(commentIds);
    expect(mockLikeRepository.getLikeByCommentIds).toBeCalledWith(commentIds);
  });
});
