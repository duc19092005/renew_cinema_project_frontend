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
    // Backgrounds
    ['bg-gradient-to-br from-purple-950 via-indigo-950 to-cyan-950', 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B1221] to-[#0A0F1C]'],
    ['bg-gradient-to-b from-purple-950 via-indigo-950 to-cyan-950', 'bg-[#0B1221]'],
    ['bg-gradient-to-b from-purple-900/95 via-indigo-900/95 to-cyan-900/95', 'bg-[#0B1121]/95'],
    ['bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-cyan-900/80', 'bg-[#131B2F]/80 border border-slate-700/50'],
    ['bg-gradient-to-br from-purple-900/95 to-cyan-900/95', 'bg-[#131B2F]/95'],
    ['bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-cyan-900/90', 'bg-[#0B1121]/90 shadow-2xl'],
    ['bg-purple-900/90', 'bg-[#131B2F]/90'],
    ['bg-purple-900', 'bg-[#0B1221]'],
    ['bg-purple-800/50', 'bg-[#1E293B]/60'],
    ['bg-purple-800/40', 'bg-[#131B2F]/80'],
    ['bg-purple-800/30', 'bg-[#131B2F]/60'],
    ['bg-purple-800/20', 'bg-[#131B2F]/40'],
    ['bg-purple-700/50', 'bg-[#1E293B]/50'],
    ['bg-purple-950/60', 'bg-slate-950/80'],

    // Sidebar Active Item
    ['bg-gradient-to-r from-purple-600/40 to-cyan-600/40 text-white border border-purple-400/30', 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/50 shadow-[inset_0_0_20px_rgba(6,182,212,0.1),0_0_15px_rgba(6,182,212,0.2)]'],
    ['bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30', 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/50 shadow-[inset_0_0_20px_rgba(6,182,212,0.1),0_0_15px_rgba(6,182,212,0.2)]'],

    // Highlights & Hovers
    ['bg-gradient-to-r from-purple-700/50 to-cyan-700/50 text-cyan-300', 'bg-gradient-to-r from-[#1E293B] to-[#0F172A] text-cyan-400 border border-slate-700'],
    ['text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400', 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400'],
    ['bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500', 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'],
    ['bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]', 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]'],
    ['hover:bg-purple-800/50 hover:text-white', 'hover:bg-cyan-900/30 hover:text-cyan-300'],
    ['hover:bg-purple-800/30 hover:text-white', 'hover:bg-cyan-900/20 hover:text-cyan-300'],
    ['hover:bg-purple-900/30', 'hover:bg-slate-800/50'],

    // Borders
    ['border-purple-500/30', 'border-slate-700/60'],
    ['border-purple-500/20', 'border-slate-700/40'],
    ['border-purple-400', 'border-cyan-400'],
    ['hover:border-purple-400', 'hover:border-cyan-400'],
    ['focus:border-purple-400', 'focus:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'],

    // Text
    ['text-purple-100', 'text-slate-200'],
    ['text-purple-200', 'text-cyan-100'],
    ['text-purple-300/70', 'text-slate-400'],
    ['text-purple-300', 'text-cyan-100'],
    ['text-purple-400', 'text-cyan-400'],
    ['text-purple-500', 'text-cyan-500'],
    ['text-purple-600', 'text-cyan-600'],
    ['placeholder-purple-300/70', 'placeholder-slate-500'],

    // Miscs
    ['bg-purple-600/80', 'bg-blue-600/80'],
    ['from-purple-600', 'from-cyan-500'],
    ['to-purple-800', 'to-blue-600'],
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
            console.log('Updated:', path.relative(baseDir, f));
        }
    } catch (e) {
        console.error('Failed to process', f, e.message);
    }
});

console.log('Total files modified:', filesModified);
