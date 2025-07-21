import pool from '../../../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { dragTaskId, hoverTaskId } = req.body;

    // Validasi input
    if (!dragTaskId || !hoverTaskId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
      // Ambil pos_id dari kedua tugas
      const { rows: dragTaskRows } = await pool.query(
        'SELECT position FROM raw_data.todos WHERE id = $1',
        [dragTaskId]
      );
      const { rows: hoverTaskRows } = await pool.query(
        'SELECT position FROM raw_data.todos WHERE id = $1',
        [hoverTaskId]
      );

      if (dragTaskRows.length === 0 || hoverTaskRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      const dragTaskPosId = dragTaskRows[0].position;
      const hoverTaskPosId = hoverTaskRows[0].position;

      // Tukar pos_id di database
      await pool.query(
        'UPDATE raw_data.todos SET position = $1 WHERE id = $2',
        [hoverTaskPosId, dragTaskId]
      );
      await pool.query(
        'UPDATE raw_data.todos SET position = $1 WHERE id = $2',
        [dragTaskPosId, hoverTaskId]
      );

      res.status(200).json({ success: true, message: 'pos_id updated successfully' });
    } catch (error) {
      console.error('Error updating pos_id:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}