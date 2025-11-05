var express = require('express');
var router = express.Router();
const db = require("../db");

/* GET home page. */
router.get('/', async function(req, res, next) {

    try {
        const result = await db.query('SELECT * FROM question');
        res.render('index', { questions: result.rows });
        console.log(result.rows);
  } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
  }
});

router.get('/question', async (req, res, next) => {
  try {
    const id = req.query.id;
    const questionResult = await db.query(
      'SELECT * FROM question WHERE questionid = $1',
      [id]
    );
    if (!questionResult.rows[0]) {
      return res.status(404).send('Question not found');
    }
    const replyResult = await db.query(
      'SELECT * FROM reply WHERE questionid = $1',
      [id]
    );
    res.render('question', {
      id,
      question: questionResult.rows[0],
      answers: replyResult.rows
    });
  } catch (err) {
    console.error('Error fetching question:', err.message);
    res.status(500).send(`Error fetching question: ${err.message}`);
  }
});

router.post('/question', async (req, res, next) => {
  try {
    const { body } = req.body;
    // Get next questionid
    const maxResult = await db.query('SELECT COALESCE(MAX(questionid), 0) + 1 as next_id FROM question');
    const questionId = maxResult.rows[0].next_id;
    const title = body.substring(0, 100) || 'Question';
    
    await db.query(
      'INSERT INTO question (questionid, userid, title, description) VALUES ($1, $2, $3, $4)',
      [questionId, 1, title, body]
    );
    res.redirect('/');
  } catch (err) {
    console.error('Error details:', err.message, err.code);
    res.status(500).send(`Error adding question: ${err.message}`);
  }
});

router.post('/answer', async (req, res, next) => {
  try {
    const replyId = Math.floor(Math.random() * 1000000);
    const { id, answer } = req.body;
    await db.query(
      'INSERT INTO reply (replyid, questionid, userid, timecreated, reply) VALUES ($1, $2, $3, $4, $5)',
      [replyId, id, 1, null, answer]
    );
    res.redirect(`/question?id=${id}`);
  } catch (err) {
    console.error('Error adding answer:', err.message);
    res.status(500).send(`Error adding answer: ${err.message}`);
  }
});

module.exports = router;
