class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const {
      replyId,
      owner,
      threadId,
      commentId,
    } = useCasePayload;

    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._replyRepository.deleteReplyById(replyId);
  }

  _verifyPayload(payload) {
    const {
      replyId,
      owner,
      threadId,
      commentId,
    } = payload;

    [replyId, owner, threadId, commentId].forEach((item) => {
      if (!item) {
        throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof item !== 'string') {
        throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    });
  }
}

module.exports = DeleteReplyUseCase;
