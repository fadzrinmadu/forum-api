/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReplyByCommentId({
    id = 'reply-123',
    content = 'payload content',
    date = '2011-10-05T14:48:00.000Z',
    isDelete = false,
  }, owner = 'user-123', commentId = 'comment-123') {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, commentId, date, isDelete],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1 = 1');
  },
};

module.exports = RepliesTableTestHelper;
