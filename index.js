/*
chongchong-free by ThebestkillerTBK
免费下载虫虫钢琴曲谱并解密
*/

//导入库
var libCCMZ = require('./libCCMZ');
var ccApi = require('./ccApi');
var util = require('./utilities');
var path = require('path');
var fs = require('fs');

//解析参数

var args = require('minimist')(process.argv.slice(2));

//显示帮助
if (!args.i) {
    console.log('-i 琴谱ID');
    console.log('-o 输出目录（可选），默认当前');
    console.log('-p 输出PDF（可选），默认不输出');
    return 1;
} 

//音乐ID
const musicID = parseInt(args.i);

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
const saveDir = path.join(__dirname, args.o ? args.o : '.');

//检测路径有效性
if(!fs.existsSync(saveDir)) {
    console.log('路径无效!');
    return 1;
}

//下载PDF
const downloadPDF = args.p;

console.log(`琴谱ID: ${musicID}\n输出目录: ${saveDir}\n生成PDF: ${util.booleanString(downloadPDF, true)}`);

let writeAndConvert = async (ccmzResolved) => {
    console.log('解析琴谱文件完成');
    const ccmzJson = JSON.stringify(ccmzResolved);

    const fileName = 'test';

    fs.writeFileSync(`${saveDir}/${fileName}.json`, ccmzJson)
    
    console.log('程序已结束');
}

//////主程序//////
let getCCMZ = async () => {
    
    var opernID, details, ccmzRaw;

    //开始获取opernID与曲谱链接
    opernID = await ccApi.getOpernID(musicID);
    details = await ccApi.getDetails(opernID);

    //解析json
    const PDFlink = ccApi.parsePDFurl(details);
    const ccmzLink = ccApi.parseCCMZurl(details);
    console.log('解析了琴谱信息');

    //开始下载并解析琴谱
    ccmzRaw = await libCCMZ.downloadCCMZ(ccmzLink);

    //开始写出，转换CCMZ
    console.log('开始解析琴谱文件');
    libCCMZ.readCCMZ(ccmzRaw, writeAndConvert);
}
//////主程序//////

//进入主程序
getCCMZ()