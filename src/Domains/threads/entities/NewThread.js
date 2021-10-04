class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    const { title, body, owner } = payload;

    [title, body, owner].forEach((item) => {
      if (!item) {
        throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof item !== 'string') {
        throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    });
  }
}

module.exports = NewThread;
