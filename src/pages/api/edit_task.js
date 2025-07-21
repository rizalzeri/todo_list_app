import pool from '../../../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { id, title, description, category, start_time, end_time, dueDate } = req.body;

      // Validasi input
      if (!id || !title || !category || !dueDate) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      // Update data di database
      const result = await pool.query(
        `
        UPDATE raw_data.todos
        SET 
          title = $1,
          description = $2,
          category_id = (
            SELECT id FROM master_data.categories WHERE name = $3
          ),
          start_time = $4,
          end_time = $5,
          due_date = $6
        WHERE id = $7
        `,
        [title, description, category, start_time, end_time, dueDate, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      res.status(200).json({ success: true, message: 'Task updated successfully' });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}