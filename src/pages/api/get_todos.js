import pool from '../../../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
        const result = await pool.query(`
            SELECT 
  t.id,
  t.position AS pos_id,
  t.title,
  c.name AS category,
  t.due_date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta' AS dueDate,
  s.status_name AS status,
  t.description,
  t.start_time AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta' AS start_time,
  t.end_time AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta' AS end_time
FROM 
  raw_data.todos t
LEFT JOIN 
  master_data.statuses s ON t.status_id = s.id
LEFT JOIN 
  master_data.categories c ON t.category_id = c.id
ORDER BY t.id ASC;
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
