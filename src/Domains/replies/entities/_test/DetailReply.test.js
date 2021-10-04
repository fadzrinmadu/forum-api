const DetailReply = require('../DetailReply');

describe('DetailReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
    };

    // Action & Assert
    expect(() => new DetailReply(payload))
      .toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 19,
      username: [],
      date: 18,
      content: 20,
    };

    // Action & Arrange
    expect(() => new DetailReply(payload))
      .toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detail reply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'payload username',
      date: 'payload date',
      content: 'payload content',
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply).toBeInstanceOf(DetailReply);
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.username).toEqual(payload.username);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.content).toEqual(payload.content);
  });

  it('should create detail reply with content value "**balasan telah dihapus**" when reply is deleted', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'payload username',
      date: 'payload date',
      content: 'payload content',
      isDelete: true,
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply).toBeInstanceOf(DetailReply);
    expect(detailReply.content).toEqual('**balasan telah dihapus**');
  });
});
