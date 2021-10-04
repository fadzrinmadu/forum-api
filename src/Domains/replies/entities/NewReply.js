class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.owner = payload.owner;
    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
  }

  _verifyPayload(payload) {
    const {
      content,
      owner,
      threadId,
      commentId,
    } = payload;

    [content, owner, threadId, commentId].forEach((item) => {
      if (!item) {
        throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof item !== 'string') {
        throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    });
  }
}

module.exports = NewReply;
