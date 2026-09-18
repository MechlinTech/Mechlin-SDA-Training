const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, 'README.md');
const docsDir = path.join(__dirname, 'docs');
const content = fs.readFileSync(readmePath, 'utf8');

function extractBlock(titleStart, blockLang = '```markdown') {
    const lines = content.split('\n');
    let inBlock = false;
    let blockLines = [];
    let foundTitle = false;
    
    for (let i = 0; i < lines.length; i++) {
        if (!foundTitle && lines[i].includes(titleStart)) {
            foundTitle = true;
            continue;
        }
        
        if (foundTitle && !inBlock && lines[i].startsWith(blockLang)) {
            inBlock = true;
            continue;
        }
        
        if (inBlock) {
            if (lines[i].startsWith('```') && !lines[i].includes('```json') && !lines[i].includes('```bash') && !lines[i].includes('```javascript') && !lines[i].includes('```jsx') && lines[i].length <= 3) {
                // If it's a generic closing block, and not an internal block (like inside templates)
                // Actually, the easiest way to find the end of the MAIN block is looking for the next task header, or just write a smarter parser.
            }
        }
    }
}
