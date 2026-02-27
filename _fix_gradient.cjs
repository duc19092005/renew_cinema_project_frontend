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
    ['bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B1221] to-[#0A0F1C]', 'bg-gradient-to-br from-slate-900 via-[#0B1221] to-[#0A0F1C]']
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
