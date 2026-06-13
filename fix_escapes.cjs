const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let changedFiles = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  // Replace \\$ with $
  content = content.replace(/\\\$/g, '$');
  // Replace \\` with `
  content = content.replace(/\\`/g, '\`');
  if (original !== content) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log('Fixed', file);
  }
});
console.log('Total files fixed:', changedFiles);
