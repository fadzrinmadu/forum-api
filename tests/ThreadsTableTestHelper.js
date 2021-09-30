/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'payload title',
    body = 'payload body',
    owner = 'user-123',
    date = '2011-10-05T14:48:00.000Z',
  }) {
    const query = {
      text: 'INSERT INTO threads values($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, date],
    };

    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1 = 1');
  },
};

module.exports = ThreadsTableTestHelper;
