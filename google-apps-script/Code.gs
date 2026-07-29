// Habit Tracker backend.
//
// Deploy this as a Web App (Deploy > New deployment > type: Web app,
// execute as: Me, who has access: Anyone). See ../README.md for the full
// walkthrough.
//
// Sheet layout (first tab of the bound spreadsheet):
//   Date | User | Updated At | <habit 1> | <habit 2> | ...
// One row per (date, user). Habit columns are created automatically the
// first time a habit name is saved, so the app's habit list and this sheet
// never need to be kept in sync manually.

var FIXED_COLUMNS = ['Date', 'User', 'Updated At'];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(FIXED_COLUMNS);
  }
  return sheet;
}

function getSecret_() {
  return PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
}

function checkSecret_(secret) {
  var expected = getSecret_();
  return expected && secret === expected;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getHeaders_(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), FIXED_COLUMNS.length);
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0];
}

function findRowIndex_(sheet, headers, date, user) {
  var dateCol = headers.indexOf('Date');
  var userCol = headers.indexOf('User');
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][dateCol]) === date && String(values[i][userCol]) === user) {
      return i + 2; // 1-indexed, +1 for header row
    }
  }
  return -1;
}

function ensureHabitColumns_(sheet, headers, habitNames) {
  var newHeaders = headers.slice();
  habitNames.forEach(function (habit) {
    if (newHeaders.indexOf(habit) === -1) {
      newHeaders.push(habit);
    }
  });
  if (newHeaders.length !== headers.length) {
    sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
  }
  return newHeaders;
}

function readHabitsFromRow_(sheet, headers, rowIndex) {
  var habits = {};
  if (rowIndex === -1) return habits;
  var values = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
  headers.forEach(function (header, i) {
    if (FIXED_COLUMNS.indexOf(header) === -1) {
      habits[header] = values[i] === true;
    }
  });
  return habits;
}

function doGet(e) {
  var params = e.parameter;
  if (!checkSecret_(params.secret)) {
    return jsonOutput_({ ok: false, error: 'Unauthorized' });
  }
  if (!params.user || !params.date) {
    return jsonOutput_({ ok: false, error: 'Missing user or date' });
  }

  var sheet = getSheet_();
  var headers = getHeaders_(sheet);
  var rowIndex = findRowIndex_(sheet, headers, params.date, params.user);
  var habits = readHabitsFromRow_(sheet, headers, rowIndex);

  return jsonOutput_({ ok: true, habits: habits });
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOutput_({ ok: false, error: 'Invalid JSON body' });
  }

  if (!checkSecret_(body.secret)) {
    return jsonOutput_({ ok: false, error: 'Unauthorized' });
  }
  if (!body.user || !body.date || !body.habits) {
    return jsonOutput_({ ok: false, error: 'Missing user, date, or habits' });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet_();
    var headers = getHeaders_(sheet);
    headers = ensureHabitColumns_(sheet, headers, Object.keys(body.habits));

    var rowIndex = findRowIndex_(sheet, headers, body.date, body.user);
    if (rowIndex === -1) {
      sheet.appendRow(new Array(headers.length).fill(''));
      rowIndex = sheet.getLastRow();
    }

    var rowValues = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
    headers.forEach(function (header, i) {
      if (header === 'Date') rowValues[i] = body.date;
      else if (header === 'User') rowValues[i] = body.user;
      else if (header === 'Updated At') rowValues[i] = new Date();
      else if (body.habits.hasOwnProperty(header)) rowValues[i] = !!body.habits[header];
    });
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowValues]);

    return jsonOutput_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
