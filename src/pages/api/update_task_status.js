import pool from '../../../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id, status } = req.body;

    // Validasi input
    if (!id || !status) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
      // Update status di database
      const result = await pool.query(
        `
        UPDATE raw_data.todos
        SET status_id = (
          SELECT id FROM master_data.statuses WHERE status_name = $1
        )
        WHERE id = $2
        `,
        [status, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      res.status(200).json({ success: true, message: 'Task status updated successfully' });
    } catch (error) {
      console.error('Error updating task status:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}