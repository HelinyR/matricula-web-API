class SupervisorController {
    constructor(db) {
        this.db = db;
    }

    getAllSupervisors(req, res) {
        this.db.query('SELECT * FROM supervisor', (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed' });
            }
            res.json(results);
        });
    }
}

module.exports = SupervisorController;