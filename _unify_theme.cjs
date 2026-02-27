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

// 1. Convert the old "modern" theme (emerald/teal) to "glowing cyber" (pink/cyan/indigo) 
// to match the newly styled files.
const styleReplacements = [
    ['from-slate-950 via-slate-900 to-emerald-950', 'from-[#0D081D] via-[#050A14] to-[#12081C] fixed inset-0 z-[-1]'],
    ['from-slate-900/90 via-slate-900/90 to-emerald-950/90', 'from-[#0E0A20]/90 shadow-2xl'],
    ['from-slate-900/80 via-slate-900/80 to-emerald-950/80', 'from-[#15102B]/80'],
    ['from-emerald-400 via-teal-400 to-emerald-400', 'from-cyan-300 via-pink-300 to-rose-300 drop-shadow-[0_0_12px_rgba(236,72,153,0.5)]'],
    ['from-emerald-500 to-teal-500', 'from-pink-500 to-rose-500'],
    ['from-emerald-500', 'from-pink-500'],
    ['to-teal-500', 'to-rose-500'],
    ['hover:from-emerald-400 hover:to-teal-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]', 'hover:from-pink-400 hover:to-rose-400 shadow-[0_0_20px_rgba(236,72,153,0.7)] text-white border border-pink-400/50'],

    // Backgrounds
    ['bg-emerald-600', 'bg-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.6)]'],
    ['bg-emerald-900/20 text-emerald-400 border border-emerald-500/50 shadow-[inset_0_0_20px_rgba(16,185,129,0.1),0_0_15px_rgba(16,185,129,0.2)]', 'bg-indigo-900/40 text-cyan-300 border border-indigo-400/60 shadow-[inset_0_0_20px_rgba(99,102,241,0.3),0_0_20px_rgba(6,182,212,0.4)]'],
    ['bg-slate-900/95', 'bg-[#0E0A20]/95'],
    ['bg-slate-800/30', 'bg-indigo-800/40'],
    ['bg-slate-700/50', 'bg-[#15102B]'],
    ['bg-slate-700/40', 'bg-indigo-800/40'],

    // Borders
    ['border-emerald-500/20', 'border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.1)]'],
    ['border-emerald-400', 'border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)]'],

    // Text
    ['text-emerald-400', 'text-pink-400'],
    ['text-emerald-50', 'text-pink-50'],
    ['text-slate-300/70', 'text-indigo-300'],
    ['text-slate-300', 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] font-medium'],

    // Specific Hovers
    ['hover:bg-slate-800/30', 'hover:bg-indigo-800/50 hover:text-cyan-200 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]'],

    // 2. Unification of Theme name. We are going to replace ALL "web3" strings in TSX files with "modern" (if talking about theme)
    // Since 'web3' is only used for the theme, we can just replace the string 'web3' directly with 'modern', BUT let's be careful.
    ["theme === 'web3'", "theme === 'modern'"],
    ["theme === \"web3\"", "theme === 'modern'"],
    ["? 'web3' :", "? 'modern' :"],
    ["== 'web3'", "=== 'modern'"],
];

let filesModified = 0;

allFiles.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        let original = content;

        styleReplacements.forEach(([from, to]) => {
            content = content.split(from).join(to);
        });

        if (content !== original) {
            fs.writeFileSync(f, content);
            filesModified++;
        }
    } catch (e) {
        console.error('Failed to process', f, e.message);
    }
});

console.log('Unification modified files:', filesModified);
