class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(replyId, { owner, threadId, commentId }) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);

    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
