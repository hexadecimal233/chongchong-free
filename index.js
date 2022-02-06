/*
chongchong-free by ThebestkillerTBK
     免费下载虫虫钢琴曲谱并解密
*/

//导入库
const util = require('./utils');
const path = require('path');
const fs = require('fs');

//打印信息
console.log
(`chongchong-free by ThebestkillerTBK
免费下载虫虫钢琴曲谱并解密
V${require('./package.json').version}`);

//解析参数
var args = require('minimist')(process.argv.slice(2));
debug = args['dbg'];

//显示帮助
if (!args.i && !debug) {
    console.log('-i 琴谱ID');
    console.log('-o 输出目录（可选），默认为output');
    console.log('-p 输出原始PDF（可选），默认不输出');
    console.log('-m 输出MP3（可选），默认不输出');
    console.log('-d 详细输出（可选），默认为关');
    return 1;
} 

let musicID, saveDir, downloadPDF, downloadMP3 = null;

//调试  musicID, saveDir, downloadPDF, downloadMP3
dbg = [1009886, './output', 0, 0];//测试的音乐

//音乐ID
debug ? musicID = dbg[0] :
musicID = parseInt(args.i);

//检测ID是否为数字
if(isNaN(musicID)) {
    console.log('琴谱ID无效!');
    return 1;
}

//检测路径有效性
if(args.o && typeof(args.o) != 'string') {
    console.log('路径无效!');
    return 1;
}

//保存路径
debug ? saveDir = dbg[1] :
saveDir = path.join(process.cwd(), args.o ? args.o : './output');

//检测路径有效性
if(!fs.existsSync(saveDir)) {
    if (util.isDetailedOutput()) console.log('路径无效!创建尝试...');
    fs.mkdirSync(saveDir);
}

//下载PDF
debug ? downloadPDF = dbg[2] :
downloadPDF = args.p;
//下载MP3
debug ? downloadMP3 = dbg[3] :
downloadMP3 = args.m;

if (util.isDetailedOutput()) {
    console.log(`琴谱ID: ${musicID}    输出目录: ${saveDir}\n生成PDF: ${util.booleanString(downloadPDF, true)}       生成MP3: ${util.booleanString(downloadMP3, true)}`);
}

//进入主程序
require('./functions').getCCMZ(musicID, saveDir, downloadMP3, downloadPDF);