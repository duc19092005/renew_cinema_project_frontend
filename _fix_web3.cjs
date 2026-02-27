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
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.json')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);

const replacements = [
    // JSON translations
    ['"themeWeb3": "Web3 View"', '"themeWeb3": "Modern View"'],
    ['"themeWeb3Desc": "Web3 Color Tone"', '"themeWeb3Desc": "Modern Color Tone"'],
    ['"themeWeb3": "Giao Diện Web3"', '"themeWeb3": "Giao Diện Hiện Đại"'],
    ['"themeWeb3Desc": "Tông màu Web3"', '"themeWeb3Desc": "Tông màu Hiện Đại"'],

    // Array types
    ["['light', 'dark', 'web3']", "['light', 'dark', 'modern']"],

    // Variables
    ["t === 'web3'", "t === 'modern'"],
    ["t === \"web3\"", "t === \"modern\""],
    ["theme === 'web3'", "theme === 'modern'"],

    // Specific UI string rendering
    ["theme === 'modern' ? 'Web3 View' :", "theme === 'modern' ? 'Modern View' :"],
    ["? 'Web3' :", "? 'Modern' :"],
    ["'Web3 View'", "'Modern View'"],
];

let filesModified = 0;

allFiles.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        let original = content;

        replacements.forEach(([from, to]) => {
            content = content.split(from).join(to);
        });

        // Safety check just catch any leftover raw web3 in Theme types
        if (f.endsWith('themeUtils.ts') || f.endsWith('.tsx')) {
            content = content.replace(/theme === 'web3'/g, "theme === 'modern'");
        }

        if (content !== original) {
            fs.writeFileSync(f, content);
            filesModified++;
            console.log('Fixed Web3 references:', path.relative(baseDir, f));
        }
    } catch (e) {
        console.error('Failed to process', f, e.message);
    }
});

console.log('Fixed web3 specific values files modified:', filesModified);
