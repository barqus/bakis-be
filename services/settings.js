const db = require('./db');
const helper = require('../helper');

async function get() {
    const rows = await db.query(
        'SELECT * FROM settings;',
    );
    const settings = helper.emptyOrRows(rows);

    return settings[0]
}

async function create(settings) {
    const result = await db.query(
        'INSERT INTO settings (start_date, end_date, last_time_history_updated) VALUES ($1, $2, $3) RETURNING *',
        [settings.start_date, settings.end_date, settings.start_date]
    );
    let message = 'Error in adding settings';

    if (result.length) {
        message = 'Settings added successfully';
    }

    return { message, result };
}

async function update(settings) {
    const rows = await db.query(
        'UPDATE settings SET start_date=$1, end_date=$2, last_time_history_updated=$3 WHERE id=1 RETURNING *',
        [settings.start_date, settings.end_date, settings.start_date],
    );
    const updatedSettings = helper.emptyOrRows(rows);

    if (updatedSettings.length <= 0) {
        throw "Settings not found"
    }
    return {
        updatedSettings,
    }
}

async function updateMatchHistoryTime(matchHistoryTime) {
    const rows = await db.query(
        'UPDATE settings SET last_time_history_updated=$1 WHERE id=1 RETURNING *',
        [matchHistoryTime],
    );
    const updatedSettings = helper.emptyOrRows(rows);

    if (updatedSettings.length <= 0) {
        throw "Settings not found"
    }
    return {
        updatedSettings,
    }
}

module.exports = {
    get,
    create,
    updateMatchHistoryTime,
    update
}