/*
chongchong-free by ThebestkillerTBK
     免费下载虫虫钢琴曲谱并解密
*/

//导入库
const libCCMZ = require('./libCCMZ');
const ccApi = require('./ccApi');
const util = require('./utils');
const path = require('path');
const fs = require('fs');

//解析参数
var args = require('minimist')(process.argv.slice(2));
debug = args['@j*9'];

//显示帮助
if (!args.i && !debug) {
    console.log('chongchong-free by ThebestkillerTBK\n     免费下载虫虫钢琴曲谱并解密');
    console.log('-i 琴谱ID');
    console.log('-o 输出目录（可选），默认为output');
    console.log('-p 输出PDF（可选），默认不输出');
    console.log('-m 输出MP3（可选），默认不输出');
    console.log('-d 详细输出（可选），默认为关');
    return 1;
} 

let musicID, saveDir, downloadPDF, downloadMP3 = null;

//调试
dbg = [917666, './output', 0, 0];

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
    console.log(`琴谱ID: ${musicID}    输出目录: ${saveDir}\n生成PDF: ${util.booleanString(downloadPDF, true)}    生成MP3: ${util.booleanString(downloadMP3, true)}`);
    console.log('·开启详细信息模式');
}

//初始化保存的文件名
var fileName = '';

let writeAndConvert = async (ccmzResolved) => {
    const ccmzObj = {
        score : JSON.parse(ccmzResolved['score']),
        midi : JSON.parse(ccmzResolved['midi'])
    }
    if (util.isDetailedOutput()) console.log('解析琴谱文件完成');
    if (debug) {
        fs.writeFileSync(`${saveDir}/${fileName}.json`, JSON.stringify(ccmzObj,"","\t"));
        if (util.isDetailedOutput()) console.log('转换为json并写出');
    }

    const midFile = libCCMZ.CCMZmidToJson(ccmzObj);
    fs.writeFileSync(`${saveDir}/${fileName}.mid`, midFile);
    if (util.isDetailedOutput()) console.log('程序已结束');

}

//////主程序//////
let getCCMZ = async () => {
    
    //初始化变量
    var opernID, details, ccmzRaw;

    //开始获取opernID与曲谱链接
    opernID = await ccApi.getOpernID(musicID);
    details = await ccApi.getDetails(opernID);

    //解析json
    const PDFlink = ccApi.parsePDFurl(details);
    const ccmzLink = ccApi.parseCCMZurl(details);
    const MP3Link = ccApi.parseMP3url(details);
    const musicName = ccApi.parseName(details);
    const authorcName = ccApi.parseAuthor(details);
    const typename = ccApi.parseTypename(details);

    fileName = musicName + '-' + musicID;

    if (util.isDetailedOutput()) { 
        console.log('解析了琴谱信息');
        console.log(`音乐名: ${musicName}`);
        console.log(`原作者: ${typename}`);
        console.log(`上传人: ${authorcName}`);
    }

    //下载PDF或MP3
    if (downloadMP3) {
        fs.writeFileSync(`${saveDir}/${fileName}.mp3`,
         await util.httpget(MP3Link, '', true, 'MP3', false));
    }

    if (downloadPDF) {
        fs.writeFileSync(`${saveDir}/${fileName}.pdf`,
         await util.httpget(PDFlink, '', true, 'PDF', false));
    }

    //开始下载并解析琴谱
    ccmzRaw = await libCCMZ.downloadCCMZ(ccmzLink);

    //开始写出，转换CCMZ
    if (util.isDetailedOutput()) console.log('开始解析琴谱文件');
    libCCMZ.readCCMZ(ccmzRaw, writeAndConvert);
}
//////主程序//////

//进入主程序
getCCMZ()