class AddedReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    const { id, content, owner } = payload;

    [id, content, owner].forEach((item) => {
      if (!item) {
        throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof item !== 'string') {
        throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    });
  }
}

module.exports = AddedReply;
