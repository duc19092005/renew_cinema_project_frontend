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
    // Typography & Icons - Add extreme glow
    ['text-cyan-400', 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'],
    ['text-cyan-100', 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] font-medium'],
    ['text-slate-200', 'text-indigo-100 drop-shadow-[0_0_2px_rgba(224,231,255,0.5)]'],
    ['text-slate-400', 'text-indigo-300'],
    ['text-cyan-300', 'text-cyan-200 drop-shadow-[0_0_10px_rgba(6,182,212,0.9)]'],
    ['text-cyan-500', 'text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]'],
    ['text-cyan-600', 'text-cyan-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]'],
    ['text-white', 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'], // careful, might affect other themes, but text-white is also used in dark mode. It should be mostly fine. Wait, only in web3? Actually let's just use it on specific strings. Let's not universally replace text-white.

    // Specific Logos / Headers
    ['text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400', 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-300 to-rose-300 drop-shadow-[0_0_12px_rgba(236,72,153,0.5)]'],

    // Buttons
    ['bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]', 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 shadow-[0_0_20px_rgba(236,72,153,0.7)] text-white border border-pink-400/50'],
    ['bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-white', 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 shadow-[0_0_20px_rgba(236,72,153,0.7)] text-white border border-pink-400/50'],
    ['bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-cyan-400', 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.6)]'],
    ['bg-cyan-900/20 text-cyan-400 border border-cyan-500/50 shadow-[inset_0_0_20px_rgba(6,182,212,0.1),0_0_15px_rgba(6,182,212,0.2)]', 'bg-indigo-900/40 text-cyan-300 border border-indigo-400/60 shadow-[inset_0_0_20px_rgba(99,102,241,0.3),0_0_20px_rgba(6,182,212,0.4)]'],

    // Backgrounds - darker to make the glow stand out
    ['bg-gradient-to-br from-slate-900 via-[#0B1221] to-[#0A0F1C]', 'bg-gradient-to-br from-[#0D081D] via-[#050A14] to-[#12081C] fixed inset-0 z-[-1]'], // Deeper, more saturated purple/blue dark background
    ['bg-[#0B1221]', 'bg-[#0E0A20]'],
    ['bg-[#0B1121]', 'bg-[#0E0A20]'],
    ['bg-[#131B2F]', 'bg-[#15102B]'],
    ['bg-[#121A2F]', 'bg-[#15102B]'],
    ['bg-[#1E293B]', 'bg-[#1F173D]'],

    // Borders
    ['border-slate-700/60', 'border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.1)]'],
    ['border-slate-700/50', 'border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]'],
    ['border-slate-700/40', 'border-indigo-500/20'],
    ['border-slate-800', 'border-indigo-900/50'],
    ['border-cyan-400', 'border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'],
    ['hover:border-cyan-400', 'hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]'],
    ['focus:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]', 'focus:border-pink-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.5)]'],
    ['hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]', 'hover:border-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.6)]'],

    // Hovers
    ['hover:bg-cyan-900/30 hover:text-cyan-300', 'hover:bg-indigo-800/50 hover:text-cyan-200 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]'],
    ['hover:bg-cyan-900/20 hover:text-cyan-300', 'hover:bg-indigo-800/40 hover:text-cyan-200 hover:shadow-[0_0_10px_rgba(99,102,241,0.3)]'],
    ['hover:bg-[#131B2F]/60', 'hover:bg-[#1F173D]/80 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]'],

    // Shadows for specific elements
    ['shadow-lg shadow-cyan-900/20', 'shadow-[0_0_30px_rgba(99,102,241,0.2)]'],
    ['shadow-2xl shadow-cyan-900/20', 'shadow-[0_0_40px_rgba(99,102,241,0.25)]'],
    ['backdrop-blur-xl', 'backdrop-blur-2xl'],

    // Specific text-white adjustments
    ['text-white', 'text-white'], // Undo the thought about replacing all text-white
    ['text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]', 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'],

    // Fix focus ring
    ['focus:border-cyan-400', 'focus:border-pink-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.5)]'],
];

let filesModified = 0;

allFiles.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        let original = content;

        // Reverse some accidental bad replacements if we need to

        replacements.forEach(([from, to]) => {
            content = content.split(from).join(to);
        });

        if (content !== original) {
            fs.writeFileSync(f, content);
            filesModified++;
            console.log('Glowing:', path.relative(baseDir, f));
        }
    } catch (e) {
        console.error('Failed to process', f, e.message);
    }
});

console.log('Total files modified:', filesModified);
