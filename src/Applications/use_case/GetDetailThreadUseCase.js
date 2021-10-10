const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class GetDetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(threadId);

    const comments = await this._commentRepository.getCommentByThreadId(threadId);
    const commentIds = comments.map((comment) => comment.id);

    const replies = await this._replyRepository.getReplyByCommentIds(commentIds);
    const likes = await this._likeRepository.getLikeByCommentIds(commentIds);

    const commentsThread = comments.map((comment) => {
      const commentReplies = replies.filter((reply) => reply.comment_id === comment.id);
      const commentLikesCount = likes.filter((like) => like.comment_id === comment.id).length;

      const detailComment = new DetailComment({
        ...comment,
        isDelete: comment.is_delete,
      });

      const detailReplies = commentReplies.map((reply) => new DetailReply({
        ...reply,
        isDelete: reply.is_delete,
      }));

      return {
        ...detailComment,
        likeCount: commentLikesCount,
        replies: detailReplies,
      };
    });

    return {
      ...thread,
      comments: commentsThread,
    };
  }

  _verifyPayload(payload) {
    const { threadId } = payload;

    if (!threadId) {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetDetailThreadUseCase;
