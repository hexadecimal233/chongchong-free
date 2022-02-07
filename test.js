console.log('开始CCMZ解码测试')
const libCCMZ = require('./libCCMZ');
const fs = require('fs');
const input = fs.readFileSync('test.json');

libCCMZ.writeMIDI(JSON.parse(input)['midi'], `./output/test.mid`);
