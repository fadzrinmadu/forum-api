const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentByThreadIdHandler = this.postCommentByThreadIdHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
  }

  async postCommentByThreadIdHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const addedComment = await addCommentUseCase.execute(request.payload, owner, threadId);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    await deleteCommentUseCase.execute(commentId, owner, threadId);

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
