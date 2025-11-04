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

  async insert(collection, item) {
    const table = this.tableName(collection);
    const keys = Object.keys(item);
    const cols = keys.map(k => `"${k}"`).join(', ');
    const params = keys.map((_, i) => `$${i + 1}`).join(', ');
    const values = keys.map(k => item[k]);
    const sql = `INSERT INTO ${table} (${cols}) VALUES (${params}) RETURNING *;`;
    const { rows } = await this.pool.query(sql, values);
    return rows[0];
  }

  async findById(collection, id) {
    const table = this.tableName(collection);
    const sql = `SELECT * FROM ${table} WHERE id = $1 LIMIT 1;`;
    const { rows } = await this.pool.query(sql, [id]);
    return rows[0] || null;
  }

  async findAll(collection, filter = {}) {
    const table = this.tableName(collection);
    const keys = Object.keys(filter);
    if (!keys.length) {
      const { rows } = await this.pool.query(`SELECT * FROM ${table};`);
      return rows;
    }
    const conds = keys.map((k, i) => `"${k}" = $${i + 1}`).join(' AND ');
    const values = keys.map(k => filter[k]);
    const { rows } = await this.pool.query(`SELECT * FROM ${table} WHERE ${conds};`, values);
    return rows;
  }

  async update(collection, id, updates) {
    const table = this.tableName(collection);
    const keys = Object.keys(updates);
    if (!keys.length) return this.findById(collection, id);
    const set = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const values = keys.map(k => updates[k]);
    values.push(id);
    const sql = `UPDATE ${table} SET ${set} WHERE id = $${values.length} RETURNING *;`;
    const { rows } = await this.pool.query(sql, values);
    return rows[0] || null;
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
