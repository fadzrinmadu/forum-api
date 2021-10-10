const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async putLikeCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);

    await likeCommentUseCase.execute({
      owner,
      threadId,
      commentId,
    });

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
