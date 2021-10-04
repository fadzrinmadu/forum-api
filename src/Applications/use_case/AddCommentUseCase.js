const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.getThreadById(newComment.threadId);
    return this._commentRepository.addCommentByThreadId(newComment);
  }
}

module.exports = AddCommentUseCase;
