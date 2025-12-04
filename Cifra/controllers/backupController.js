const path = require('path');
const fs = require('fs');

exports.download = async (req, res) => {
  const dbPath = path.join(__dirname, '..', 'orcabem.sqlite');
  if (!fs.existsSync(dbPath)) {
    req.flash('error_msg', 'Banco ainda não foi criado.');
    return res.redirect('/dashboard');
  }
  res.download(dbPath, 'orcabem.sqlite');
};

exports.restaurar = async (req, res) => {
  try {
    const file = req.file;
    if (!file) { req.flash('error_msg', 'Envie um arquivo .sqlite'); return res.redirect('/dashboard'); }
    const dest = path.join(__dirname, '..', 'orcabem.sqlite');
    fs.copyFileSync(file.path, dest);
    req.flash('success_msg', 'Backup restaurado. Reinicie o servidor.');
    res.redirect('/dashboard');
  } catch (e) {
    console.error(e);
    req.flash('error_msg', 'Erro ao restaurar backup.');
    res.redirect('/dashboard');
  }
};
