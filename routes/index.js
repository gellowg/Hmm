var express = require('express');
var router = express.Router();
const db = require("../db");

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const result = await db.query('SELECT * FROM user');
        res.render('index', { questions: result.rows });
  } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
  }
});

router.get('/question', (req, res, next) => {
    res.render('question', { id: req.query.id });
});

router.post('/question', (req, res, next) => {
    router.post('/question', async (req, res, next) => {
  try {
    const { body } = req.body;
    await db.query(
      'INSERT INTO questions (body) VALUES ($1)',
      [body]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding question');
  }
});
})

module.exports = router;
