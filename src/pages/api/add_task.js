import pool from '../../../lib/db.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const {
                title,
                description,
                due_date,
                start_time,
                end_time,
                category_id,
                status_id,
            } = req.body;

            // Validasi input
            if (!title || !due_date || !start_time || !end_time || !category_id || !status_id) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            // Ambil nilai position terakhir dari database
            const positionResult = await pool.query(
                'SELECT COALESCE(MAX(position), 0) AS max_position FROM raw_data.todos'
            );
            const newPosition = positionResult.rows[0].max_position + 1;

            // Insert data ke database
            const result = await pool.query(
                `
                INSERT INTO raw_data.todos 
                (title, description, due_date, start_time, end_time, position, category_id, status_id, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
                RETURNING id
                `,
                [title, description, due_date, start_time, end_time, newPosition, category_id, status_id]
            );

            res.status(201).json({ success: true, id: result.rows[0].id });
        } catch (error) {
            console.error('Error inserting todo:', error);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}