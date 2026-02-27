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
    ['drop-shadow-md drop-shadow-md', ''],
    [' drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]', ''],
    [' drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]', ''],
    ['text-cyan-200  ', 'text-cyan-400 '],
    ['text-cyan-200 "', 'text-cyan-400"'],
    ['text-cyan-200 \'', 'text-cyan-400\''],
];

let filesModified = 0;

allFiles.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        let original = content;

        replacements.forEach(([from, to]) => {
            content = content.split(from).join(to);
        });

        // Fix any leftover `text-cyan-200 ` specifically for MovieManager
        content = content.replace(/text-cyan-200(?=\s|")/g, 'text-cyan-400');

        if (content !== original) {
            fs.writeFileSync(f, content);
            filesModified++;
            console.log('Cleaned drop-shadows:', path.relative(baseDir, f));
        }
    } catch (e) {
        console.error('Failed to process', f, e.message);
    }
});

console.log('Total files modified:', filesModified);
