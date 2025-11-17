const { Pool } = require('pg');

class PostgresAdapter {
  constructor(poolConfig = {}) {
    this.pool = new Pool(poolConfig);

    this.tableMap = {
      alunos: 'aluno',
      empresas: 'empresa',
      vantagens: 'vantagem',
      transacoes: 'transacao',
      resgates: 'resgate',
      usuarios: 'usuario',
      instituicoes: 'instituicao'
    };
  }

  tableName(collection) {
    return this.tableMap[collection] || collection;
  }

  async insert(collection, record) {
    const table = this.tableName(collection);
    const data = record || {};
    const keys = Object.keys(data).filter((k) => data[k] !== undefined);

    if (!keys.length) {
      const sql = `INSERT INTO ${table} DEFAULT VALUES RETURNING *;`;
      const res = await this.pool.query(sql);
      return res.rows[0];
    }

    const columns = keys.join(', ');
    const placeholders = keys.map((_, idx) => `$${idx + 1}`);
    const values = keys.map((k) => data[k]);

    const sql = `
      INSERT INTO ${table} (${columns})
      VALUES (${placeholders.join(', ')})
      RETURNING *;
    `;

    const res = await this.pool.query(sql, values);
    return res.rows[0];
  }

  async findById(collection, id) {
    const table = this.tableName(collection);
    const sql = `SELECT * FROM ${table} WHERE id = $1;`;
    const res = await this.pool.query(sql, [id]);
    return res.rows[0] || null;
  }

  async findAll(collection, filter = {}) {
    const table = this.tableName(collection);
    const keys = Object.keys(filter || {}).filter(
      (k) => filter[k] !== undefined && filter[k] !== null
    );

    let sql = `SELECT * FROM ${table}`;
    const values = [];

    if (keys.length) {
      const conds = keys.map((key, idx) => {
        values.push(filter[key]);
        return `${key} = $${idx + 1}`;
      });
      sql += ' WHERE ' + conds.join(' AND ');
    }

    sql += ' ORDER BY id;';

    const res = await this.pool.query(sql, values);
    return res.rows;
  }

  async update(collection, id, updates = {}) {
    const table = this.tableName(collection);
    const keys = Object.keys(updates || {}).filter(
      (k) => updates[k] !== undefined
    );

    if (!keys.length) {
      return this.findById(collection, id);
    }

    const sets = keys.map((key, idx) => `${key} = $${idx + 1}`);
    const values = keys.map((k) => updates[k]);
    values.push(id);

    const sql = `
      UPDATE ${table}
      SET ${sets.join(', ')}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;

    const res = await this.pool.query(sql, values);
    return res.rows[0] || null;
  }

  async delete(collection, id) {
    const table = this.tableName(collection);
    const sql = `DELETE FROM ${table} WHERE id = $1;`;
    const res = await this.pool.query(sql, [id]);
    return res.rowCount > 0;
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = PostgresAdapter;
