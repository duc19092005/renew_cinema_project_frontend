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
    // Fix the unclickable page bug (z-index issue on root wrapper)
    ['fixed inset-0 z-[-1] ', ''],
    [' fixed inset-0 z-[-1]', ''],

    // Remove the horrible white drop shadow that ruined light and dark modes
    [' drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]', ''],

    // Tone down the neon glow to make "Modern" less glaring 
    ['drop-shadow-[0_0_12px_rgba(236,72,153,0.5)]', 'drop-shadow-sm'],
    ['shadow-[0_0_20px_rgba(236,72,153,0.7)]', 'shadow-lg shadow-pink-500/20'],
    ['shadow-[0_0_15px_rgba(236,72,153,0.6)]', 'shadow-md shadow-pink-500/20'],
    ['shadow-[0_0_20px_rgba(236,72,153,0.2)]', 'shadow-md shadow-pink-500/10'],
    ['shadow-[0_0_15px_rgba(236,72,153,0.5)]', 'shadow-md shadow-pink-500/20'],
    ['shadow-[inset_0_0_20px_rgba(99,102,241,0.3),0_0_20px_rgba(6,182,212,0.4)]', 'shadow-inner shadow-cyan-500/20'],
    ['shadow-[0_0_12px_rgba(99,102,241,0.1)]', 'shadow-sm shadow-indigo-500/10'],
    ['shadow-[0_0_15px_rgba(99,102,241,0.15)]', 'shadow-sm shadow-indigo-500/10'],
    ['drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]', 'drop-shadow-md'],
    ['drop-shadow-[0_0_10px_rgba(6,182,212,0.9)]', 'drop-shadow-md'],
    ['drop-shadow-[0_0_2px_rgba(224,231,255,0.5)]', ''],
    ['shadow-[0_0_10px_rgba(6,182,212,0.4)]', 'shadow-md shadow-cyan-500/20'],
    ['shadow-[0_0_15px_rgba(6,182,212,0.6)]', 'shadow-lg shadow-cyan-500/30'],
    ['shadow-[0_0_10px_rgba(99,102,241,0.3)]', 'shadow-md shadow-indigo-500/20'],
    ['shadow-[0_0_15px_rgba(99,102,241,0.4)]', 'shadow-lg shadow-indigo-500/20'],
    ['shadow-[0_0_30px_rgba(99,102,241,0.2)]', 'shadow-xl shadow-cyan-900/20'],
    ['shadow-[0_0_40px_rgba(99,102,241,0.25)]', 'shadow-2xl shadow-cyan-900/20'],
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
            console.log('Fixed:', path.relative(baseDir, f));
        }
    } catch (e) {
        console.error('Failed to process', f, e.message);
    }
});

console.log('Total files modified:', filesModified);
