// --- KONFIGURASI ---
const SCRIPT_PROP = PropertiesService.getScriptProperties();

// --- SETUP AWAL (Jalankan fungsi ini sekali saja) ---
function setup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Sheet Users
  createSheetIfNotExists(doc, 'Users', ['uid', 'username', 'password', 'role', 'nama_lengkap', 'kelas', 'level', 'total_poin', 'foto_url', 'nip']);
  
  // 2. Sheet Laporan
  createSheetIfNotExists(doc, 'Laporan', ['report_id', 'student_uid', 'nama_siswa', 'kelas', 'judul_buku', 'kategori', 'ringkasan', 'tanggal_kirim', 'status', 'feedback_guru', 'foto_bukti']);
  
  // 3. Sheet Sekolah
  createSheetIfNotExists(doc, 'Sekolah', ['id', 'nama', 'alamat', 'akreditasi', 'kepala_sekolah', 'tahun_ajaran', 'nip_kepala_sekolah', 'kota']);
  
  // 4. Sheet Kelas
  createSheetIfNotExists(doc, 'Kelas', ['id', 'nama', 'wali_kelas', 'jumlah_siswa', 'tahun_pelajaran']);
}

function createSheetIfNotExists(doc, sheetName, headers) {
  let sheet = doc.getSheetByName(sheetName);
  if (!sheet) {
    sheet = doc.insertSheet(sheetName);
    sheet.appendRow(headers); // Buat header
  }
}

// --- API HANDLERS ---

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const action = e.parameter.action;
    
    let result = {};

    if (action === 'getUsers') {
      result = getData(doc, 'Users');
    } else if (action === 'getLaporan') {
      result = getData(doc, 'Laporan');
    } else if (action === 'getSekolah') {
      result = getData(doc, 'Sekolah');
    } else if (action === 'getKelas') {
      result = getData(doc, 'Kelas');
    } 
    // --- HANDLERS BARU (KELAS) ---
    else if (action === 'addClass') {
      result = addRow(doc, 'Kelas', e.parameter);
    } else if (action === 'updateClass') {
      result = updateRow(doc, 'Kelas', 'id', e.parameter.id, e.parameter);
    } else if (action === 'deleteClass') {
      result = deleteRow(doc, 'Kelas', 'id', e.parameter.id);
    }
    // --- HANDLERS USER ---
    else if (action === 'addUser') {
      result = addRow(doc, 'Users', e.parameter);
    } else if (action === 'updateUser') {
      result = updateRow(doc, 'Users', 'uid', e.parameter.uid, e.parameter);
    } else if (action === 'deleteUser') {
      result = deleteRow(doc, 'Users', 'uid', e.parameter.uid);
    }
    // --- HANDLERS LAIN ---
    else if (action === 'addLaporan') {
      result = addRow(doc, 'Laporan', e.parameter);
    } else if (action === 'updateLaporan') {
      result = updateRow(doc, 'Laporan', 'report_id', e.parameter.report_id, e.parameter);
    } else if (action === 'updateSekolah') {
      result = updateRow(doc, 'Sekolah', 'id', 'sekolah', e.parameter);
    } else if (action === 'deleteLaporan') {
      result = deleteRow(doc, 'Laporan', 'report_id', e.parameter.report_id);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', data: result }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// --- HELPER FUNCTIONS ---

function getData(doc, sheetName) {
  const sheet = doc.getSheetByName(sheetName);
  if (!sheet) return []; // Return empty array if sheet missing
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return []; // Only headers or empty

  const headers = rows[0];
  const data = [];
  
  for (let i = 1; i < rows.length; i++) {
    let row = rows[i];
    let obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    data.push(obj);
  }
  return data;
}

function addRow(doc, sheetName, data) {
  const sheet = doc.getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = [];
  
  headers.forEach(header => {
    newRow.push(data[header] || '');
  });
  
  sheet.appendRow(newRow);
  return "Row added";
}

function updateRow(doc, sheetName, keyField, keyValue, newData) {
  const sheet = doc.getSheetByName(sheetName);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const keyIndex = headers.indexOf(keyField);
  
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][keyIndex]) === String(keyValue)) {
      headers.forEach((header, colIndex) => {
        if (newData[header] !== undefined) {
          sheet.getRange(i + 1, colIndex + 1).setValue(newData[header]);
        }
      });
      return "Row updated";
    }
  }
  return "Row not found";
}

function deleteRow(doc, sheetName, keyField, keyValue) {
  const sheet = doc.getSheetByName(sheetName);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const keyIndex = headers.indexOf(keyField);
  
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][keyIndex]) === String(keyValue)) {
      sheet.deleteRow(i + 1);
      return "Row deleted";
    }
  }
  return "Row not found";
}
