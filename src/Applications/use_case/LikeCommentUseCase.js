class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { threadId, commentId, owner } = useCasePayload;

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);

    const likedComment = await this._likeRepository.verifyLikedComment(commentId, owner);

    if (!likedComment) {
      await this._likeRepository.addLikeByCommentId(commentId, owner);
    } else {
      await this._likeRepository.deleteLikeByCommentId(commentId, owner);
    }
  }

  _verifyPayload(payload) {
    const { threadId, commentId, owner } = payload;

    [threadId, commentId, owner].forEach((item) => {
      if (!item) {
        throw new Error('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof item !== 'string') {
        throw new Error('LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    });
  }
}

module.exports = LikeCommentUseCase;
