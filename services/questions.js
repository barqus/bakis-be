const db = require('./db');
const helper = require('../helper');

async function getAll() {
    const rows = await db.query(
        'SELECT * FROM questions;',
    );
    const questions = helper.emptyOrRows(rows);

    return questions
}

async function create(question) {
    const result = await db.query(
        'INSERT INTO questions (question) VALUES ($1) RETURNING *',
        [question.question]
    );
    let message = 'Error in creating question';

    if (result.length) {
        message = 'Question added successfully';
    }

    return { message, result };
}

async function update(question, questionID) {
    const rows = await db.query(
        'UPDATE questions SET question=$1 WHERE id=$2 RETURNING *',
        [question.question, questionID],
    );
    const updatedQuestion = helper.emptyOrRows(rows);

    if (updatedQuestion.length <= 0) {
        throw "Question not found"
    }
    return updatedQuestion
}

async function deleteByID(questionID) {
    const rows = await db.query(
        'DELETE FROM questions WHERE id=$1 RETURNING id', [questionID],
    );
    const deletedQuestionID = helper.emptyOrRows(rows);

    if (deletedQuestionID.length <= 0) {
        throw "Question not found"
    }

    return deletedQuestionID
}

module.exports = {
    getAll,
    deleteByID,
    create,
    update
}