class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.owner = payload.owner;
    this.threadId = payload.threadId;
  }

  _verifyPayload(payload) {
    const { content, owner, threadId } = payload;

    [content, owner, threadId].forEach((item) => {
      if (!item) {
        throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof item !== 'string') {
        throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    });
  }
}

module.exports = NewComment;
