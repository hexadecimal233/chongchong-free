
const libCCMZ = require('./libCCMZ');
const ccApi = require('./ccApi');
const util = require('./utils');
const fs = require('fs');

var args = require('minimist')(process.argv.slice(2));
debug = args['dbg'];

//初始化保存的文件名
var fileName = 'test';
var  _saveDir = './output';

let writeAndConvert = async (ccmzResolved) => {
    if (ccmzResolved['ver'] == 2) {
        const ccmzObj = {
            score : JSON.parse(ccmzResolved['score']),
            midi : JSON.parse(ccmzResolved['midi'])
        }
        if (util.isDetailedOutput()) console.log('解析琴谱文件完成');
        if (debug) {
            fs.writeFileSync(`${_saveDir}/${fileName}.json`, JSON.stringify(ccmzObj,"","\t"));
            if (util.isDetailedOutput()) console.log('转换为json并写出');
        }
        if (util.isDetailedOutput()) console.log('解析MIDI');
        libCCMZ.writeMIDI(ccmzObj['midi'], `${_saveDir}/${fileName}.mid`);
    } else {
        fs.writeFileSync(`${_saveDir}/${fileName}.mid`, ccmzResolved['midi']);
    }
    
    if (util.isDetailedOutput()) console.log('成功写出MIDI文件');
    console.log('下载成功!');
    if (util.isDetailedOutput()) console.log('程序已结束');

}

//////主程序//////
let getCCMZ = async (musicID, saveDir, downloadMP3, downloadPDF) => {
    _saveDir = saveDir;
    
    //初始化变量
    var opernID, details, ccmzRaw;

    //开始获取opernID与曲谱链接
    opernID = await ccApi.getOpernID(musicID);
    details = await ccApi.getDetails(opernID);

    if (util.isDetailedOutput()) console.log('开始解析信息');
    var detailsJSON = JSON.parse(details)['list'];

    //解析json
    const PDFlink = detailsJSON['pdf'];//解析PDF链接
    const ccmzLink = detailsJSON['play_json'];//解析CCMZ链接
    const MP3Link = detailsJSON['audition_urtext'];//解析MP3链接
    const musicName = detailsJSON['name'];//获取歌曲名
    const authorcName = detailsJSON['author'];//获取上传者
    const typename = detailsJSON['typename'];//获取原作者
    const paid = detailsJSON['is_pay'];//获取付费

    fileName = musicName.replace(/[/\\:\|\*\?"<>]/g," ") + '-' + musicID;

    console.log('解析了琴谱信息');
    console.log(`付费歌曲: ${util.booleanString(paid == '1', true)}`)
    console.log(`音乐名: ${musicName}`);
    console.log(`原作者: ${typename}`);
    console.log(`上传人: ${authorcName}`);

    
    //下载PDF或MP3
    if (downloadMP3) {
        if (util.isDetailedOutput()) console.log('下载MP3');
        if (MP3Link != '') fs.writeFileSync(`${saveDir}/${fileName}.mp3`, await util.httpget(MP3Link, '', true, 'MP3', false));
        else console.log('无mp3可下载');
    }

    if (downloadPDF) {
        if (util.isDetailedOutput()) console.log('下载PDF');
        if (PDFlink != '') fs.writeFileSync(`${saveDir}/${fileName}.pdf`, await util.httpget(PDFlink, '', true, 'PDF', false));
        else console.log('无原始pdf可下载');
    }

    if (ccmzLink != '') {
        if (util.isDetailedOutput()) console.log('开始下载并解析琴谱');
        ccmzRaw = await libCCMZ.downloadCCMZ(ccmzLink);

        //开始写出，转换CCMZ
        if (util.isDetailedOutput()) console.log('开始解析琴谱文件');
        libCCMZ.readCCMZ(ccmzRaw, writeAndConvert);
    } else {
        console.log('无MIDI可下载');
        if (util.isDetailedOutput()) console.log('程序已结束');
    }

}
//////主程序//////

module.exports = { getCCMZ, writeAndConvert };
