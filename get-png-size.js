const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'assets/images/ekkehomo');
['illu1.png', 'illu2.png', 'illu3.png'].forEach((name, i) => {
  const buf = fs.readFileSync(path.join(dir, name));
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  console.log('illu' + (i + 1) + ':', w, 'x', h);
});
