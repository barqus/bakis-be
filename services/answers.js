const db = require('./db');
const helper = require('../helper');

async function getAll() {
    const rows = await db.query(
        'SELECT * FROM answers;',
    );
    const questions = helper.emptyOrRows(rows);

    return questions
}

async function create(answer) {
    const result = await db.query(
        'INSERT INTO answers (answer, question_id, participant_id) VALUES ($1, $2, $3) RETURNING *',
        [answer.answer, answer.question_id, answer.participant_id]
    );
    let message = 'Error in creating answer';

    if (result.length) {
        message = 'Answer added successfully';
    }

    return { message, result };
}

async function update(answer, answerID) {
    const rows = await db.query(
        'UPDATE answers SET answer=$1, question_id=$2, participant_id=$3 WHERE id=$4 RETURNING *',
        [answer.answer, answer.question_id, answer.participant_id, answerID],
    );
    const updatedAnswer = helper.emptyOrRows(rows);

    if (updatedAnswer.length <= 0) {
        throw "Answer not found"
    }
    return updatedAnswer
}

async function deleteByID(answerID) {
    const rows = await db.query(
        'DELETE FROM answers WHERE id=$1 RETURNING id', [answerID],
    );
    const deletedAnswerID = helper.emptyOrRows(rows);

    if (deletedAnswerID.length <= 0) {
        throw "Answer not found"
    }

    return deletedAnswerID
}

module.exports = {
    getAll,
    deleteByID,
    create,
    update
}