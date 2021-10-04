const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const newReply = new NewReply(useCasePayload);
    await this._threadRepository.getThreadById(newReply.threadId);
    await this._commentRepository.getCommentById(newReply.commentId);
    return this._replyRepository.addReplyByCommentId(useCasePayload);
  }
}

module.exports = AddReplyUseCase;
