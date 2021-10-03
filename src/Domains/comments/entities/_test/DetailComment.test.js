const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
    };

    // Action & Assert
    expect(() => new DetailComment(payload))
      .toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
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
    expect(() => new DetailComment(payload))
      .toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detail comment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'payload username',
      date: 'payload date',
      content: 'payload content',
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
  });

  it('should create detail comment with content value "**komentar telah dihapus**" when comment is deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'payload username',
      date: 'payload date',
      content: 'payload content',
      isDelete: true,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
  });
});
