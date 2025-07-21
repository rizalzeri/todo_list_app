import pool from '../../../lib/db.js';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        try {
            const { id } = req.body;

            // Validasi input
            if (!id) {
                return res.status(400).json({ success: false, message: 'Missing required field: id' });
            }

            // Delete data dari database
            const result = await pool.query(
                `
                DELETE FROM raw_data.todos
                WHERE id = $1
                `,
                [id]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }

            res.status(200).json({ success: true, message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Error deleting todo:', error);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
