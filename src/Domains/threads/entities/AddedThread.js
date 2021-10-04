class AddedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    const { id, title, owner } = payload;

    [id, title, owner].forEach((item) => {
      if (!item) {
        throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof item !== 'string') {
        throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    });
  }
}

module.exports = AddedThread;
