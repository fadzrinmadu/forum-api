const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplyByCommentId(newReply, owner, commentId) {
    const { content } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, commentId, date, isDelete],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getReplyByCommentId(commentId) {
    const query = {
      text: 'SELECT replies.*, users.username AS username FROM replies INNER JOIN users ON replies.owner = users.id WHERE comment_id = $1 ORDER BY date',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => (
      new DetailReply({
        ...row,
        isDelete: row.is_delete,
      })
    ));
  }
}

module.exports = ReplyRepositoryPostgres;
