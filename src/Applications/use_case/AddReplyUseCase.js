const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, { owner, threadId, commentId }) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);

    const newReply = new NewReply(useCasePayload);
    return this._replyRepository.addReplyByCommentId(useCasePayload, owner, commentId);
  }
}

module.exports = AddReplyUseCase;
