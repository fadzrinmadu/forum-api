const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyLikedComment(commentId, owner) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    return !!result.rowCount;
  }

  async addLikeByCommentId(commentId, owner) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await this._pool.query(query);
  }

  async getLikeByCommentIds(commentIds) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = ANY($1::text[])',
      values: [commentIds],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteLikeByCommentId(commentId, owner) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }
}

module.exports = LikeRepositoryPostgres;
