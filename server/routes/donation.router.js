const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {
    const sqlText = `SELECT * FROM donors`
    pool.query(sqlText)
        .then((result) => {
            console.log('Got stuff back from the database', result)
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error)
            res.sendStatus(500);
        })
});


router.post('/', async (req, res) => {
    try {
        const newDonor = req.body;
        const sqlText = `
            INSERT INTO "donors" 
                (name, email, phone, address, amount, "Paid", "Donation_date") 
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *
        `;

        const result = await pool.query(sqlText, [
            newDonor.name,
            newDonor.email,
            newDonor.phone,
            newDonor.address,
            newDonor.amount,
            newDonor.Paid || false,
            newDonor.Donation_date || new Date()
        ]);

        const createdDonor = result.rows[0];
        console.log('Added new donor to the database:', createdDonor);
        res.status(201).json(createdDonor);
    } catch (error) {
        console.error('Error adding donor:', error);
        if (error.code === '23505') { // unique violation
            res.status(400).json({ error: 'Email address already exists' });
        } else {
            res.status(500).json({ error: 'Failed to add donor' });
        }
    }
});




router.put('/donors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, amount, Paid, Donation_date } = req.body;

        const sqlText = `
            UPDATE "donors" 
            SET 
                "name" = $1, 
                "email" = $2, 
                "phone" = $3, 
                "address" = $4, 
                "amount" = $5, 
                "Paid" = $6, 
                "Donation_date" = $7 
            WHERE "donor_id" = $8 
            RETURNING *
        `;

        const result = await pool.query(sqlText, [
            name,
            email,
            phone,
            address,
            amount,
            Paid,
            Donation_date,
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        const updatedDonor = result.rows[0];
        console.log('Updated donor:', updatedDonor);
        res.json(updatedDonor);
    } catch (error) {
        console.error('Error updating donor:', error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'Email address already exists' });
        } else {
            res.status(500).json({ error: 'Failed to update donor' });
        }
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sqlText = `
            DELETE FROM "donors" 
            WHERE "donor_id" = $1 
            RETURNING *
        `;

        const result = await pool.query(sqlText, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        const deletedDonor = result.rows[0];
        console.log('Deleted donor:', deletedDonor);
        res.json({
            message: 'Donor deleted successfully',
            donor: deletedDonor
        });
    } catch (error) {
        console.error('Error deleting donor:', error);
        res.status(500).json({ error: 'Failed to delete donor' });
    }
});

module.exports = router;