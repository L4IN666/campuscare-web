const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'reports.json');

app.use(cors());
app.use(express.json());

// Helper membaca data JSON
const readReports = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper menulis data ke JSON
const writeReports = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// ================= API ENDPOINTS FOR POSTMAN =================

// READ (GET) - Ambil semua data laporan
app.get('/api/reports', (req, res) => {
  const reports = readReports();
  res.json(reports);
});

// CREATE (POST) - Tambah laporan baru
app.post('/api/reports', (req, res) => {
  const reports = readReports();
  const newReport = {
    id: Date.now(),
    category: req.body.category || "Umum",
    title: req.body.title || "",
    location: req.body.location || "",
    status: req.body.status || "Menunggu",
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  
  reports.push(newReport);
  writeReports(reports);
  res.status(201).json(newReport);
});

// UPDATE (PUT) - Ubah laporan berdasarkan ID
app.put('/api/reports/:id', (req, res) => {
  const reports = readReports();
  const id = Number(req.params.id);
  const index = reports.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Laporan tidak ditemukan' });
  }

  reports[index] = { ...reports[index], ...req.body };
  writeReports(reports);
  res.json(reports[index]);
});

// DELETE (DELETE) - Hapus laporan berdasarkan ID
app.delete('/api/reports/:id', (req, res) => {
  let reports = readReports();
  const id = Number(req.params.id);
  const initialLength = reports.length;

  reports = reports.filter(r => r.id !== id);

  if (reports.length === initialLength) {
    return res.status(404).json({ message: 'Laporan tidak ditemukan' });
  }

  writeReports(reports);
  res.json({ message: 'Laporan berhasil dihapus' });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});