const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-white': 'bg-slate-800/50',
  'bg-gray-50': 'bg-slate-800/80',
  'bg-gray-100': 'bg-slate-700',
  'bg-gray-200': 'bg-slate-600',
  'bg-gray-900': 'bg-slate-900',
  
  'text-gray-900': 'text-textMain',
  'text-gray-800': 'text-textMain',
  'text-gray-700': 'text-textMuted',
  'text-gray-600': 'text-textMuted',
  'text-gray-500': 'text-slate-400',
  
  'border-gray-100': 'border-slate-700',
  'border-gray-200': 'border-slate-700',
  'border-gray-300': 'border-slate-600',
  
  'hover:bg-gray-50': 'hover:bg-slate-700',
  'hover:bg-gray-100': 'hover:bg-slate-600',
  'hover:bg-gray-200': 'hover:bg-slate-500',
  
  'bg-blue-50': 'bg-primary/10',
  'text-blue-600': 'text-primary',
  'text-blue-700': 'text-primary',
  'border-blue-100': 'border-primary/30',
  'hover:bg-blue-50': 'hover:bg-primary/20',

  'bg-purple-50': 'bg-secondary/10',
  'text-purple-600': 'text-secondary',
  'text-purple-700': 'text-secondary',
  'hover:bg-purple-50': 'hover:bg-secondary/20',

  'bg-green-50': 'bg-green-500/10',
  'text-green-700': 'text-green-400',
  'text-green-600': 'text-green-400',
  'border-green-100': 'border-green-500/30',

  'bg-orange-50': 'bg-orange-500/10',
  'text-orange-700': 'text-orange-400',
  'text-orange-600': 'text-orange-400',

  'bg-red-50': 'bg-red-500/10',
  'text-red-700': 'text-red-400',
  'text-red-600': 'text-red-400',
  'hover:bg-red-50': 'hover:bg-red-500/20',
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
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
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  Object.entries(replacements).forEach(([oldClass, newClass]) => {
    // Regex to match the exact class word and not substrings
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
    content = content.replace(regex, newClass);
  });

  if (original !== content) {
    fs.writeFileSync(file, content);
    changedCount++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Updated classes in ${changedCount} files.`);
