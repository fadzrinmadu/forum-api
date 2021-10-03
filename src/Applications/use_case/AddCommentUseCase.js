const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, { owner, threadId }) {
    await this._threadRepository.getThreadById(threadId);

    const newComment = new NewComment(useCasePayload);
    return this._commentRepository.addCommentByThreadId(newComment, owner, threadId);
  }
}

module.exports = AddCommentUseCase;
