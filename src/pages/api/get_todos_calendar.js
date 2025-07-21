import pool from '../../../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
        const result = await pool.query(`
            SELECT 
              t.id,
              t.title,
              t.start_time AS start,
              t.end_time AS end,
              t.description,
              c.name AS category
            FROM 
              raw_data.todos t
            LEFT JOIN 
              master_data.statuses s ON t.status_id = s.id
            LEFT JOIN 
              master_data.categories c ON t.category_id = c.id
          `);
          
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
