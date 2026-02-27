const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const srcDir = path.join(baseDir, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);

const replacements = [
    ['from-slate-900/95 to-emerald-950/95', 'from-[#15102B]/95 to-[#0b061c]/95'],
    ['text-emerald-600', 'text-pink-400 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]'],
    ['bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-pink-500 hover:to-rose-500', 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 border border-pink-400/50 shadow-[0_0_15px_rgba(236,72,153,0.6)]'],
    ['bg-gradient-to-br from-emerald-600 to-teal-600', 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-[0_0_15px_rgba(236,72,153,0.6)]'],
    ['bg-gradient-to-r from-emerald-600 to-teal-600', 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-[0_0_15px_rgba(236,72,153,0.6)]'],
    ['from-emerald-600 to-emerald-800', 'from-pink-600 to-rose-900'],
    ['shadow-emerald-500/20', 'shadow-pink-500/20'],
    ['bg-emerald-500 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]', 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)]'],
    ['bg-emerald-500', 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)] text-white']
];

let filesModified = 0;

allFiles.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        let original = content;

        replacements.forEach(([from, to]) => {
            content = content.split(from).join(to);
        });

        if (content !== original) {
            fs.writeFileSync(f, content);
            filesModified++;
            console.log('Cleaned emeralds in:', path.relative(baseDir, f));
        }
    } catch (e) {
        console.error('Failed to process', f, e.message);
    }
});

console.log('Total files modified:', filesModified);
