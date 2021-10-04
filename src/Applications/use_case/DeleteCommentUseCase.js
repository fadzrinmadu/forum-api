class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);

    const { commentId, threadId, owner } = useCasePayload;
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._commentRepository.deleteCommentById(commentId);
  }

  _validatePayload(payload) {
    const { commentId, owner, threadId } = payload;

    [commentId, owner, threadId].forEach((item) => {
      if (!item) {
        throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof item !== 'string') {
        throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    });
  }
}

module.exports = DeleteCommentUseCase;
