const LikeRepository = require('../LikeRepository');

describe('LikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    await expect(likeRepository.verifyLikedComment('', ''))
      .rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(likeRepository.addLikeByCommentId('', ''))
      .rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(likeRepository.getLikeCountByCommentId(''))
      .rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(likeRepository.deleteLikeByCommentId('', ''))
      .rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
