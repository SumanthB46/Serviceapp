const fs = require('fs');

const fixFile = (path) => {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/\\\`/g, '\`');
  content = content.replace(/\\\$/g, '\$');
  fs.writeFileSync(path, content);
  console.log('Fixed backticks in ' + path);
}

fixFile('frontend/components/admin/reports/BIChartsGrid.tsx');
fixFile('frontend/components/admin/reports/BIKPICards.tsx');
