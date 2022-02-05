//解析CCMZ文件，来自Controller.js

const JSZip = require('jszip');
const util = require('./utils');

//歌谱和midi
class CCMZ {
  score;
  midi;
}

const libCCMZ = {
  //下载CCMZ
  downloadCCMZ(url) {
    return util.httpget(url, '', true, '琴谱文件', false);
  },

  //解析CCMZ
  readCCMZ(buffer,callback) {
    let info = new CCMZ(null, null);
    let version = (new Uint8Array(buffer.slice(0, 1)))[0];
    console.log("CCMZ版本:", version);
    let data = new Uint8Array(buffer.slice(1))
    if (version == 1) {
      JSZip.loadAsync(data).then((zip) => {
        zip
          .file("data.xml")
          .async("string")
          .then((json) => {
            info.score = json;
            zip
              .file("data.mid")
              .async("string")
              .then((json) => {
                info.midi = json;
                callback(info);
              });
          });
      });
    } else if (version == 2) {
      data = data.map((value) => {
        return value % 2 == 0 ? value + 1 : value - 1
      })
      JSZip.loadAsync(data).then((zip) => {
        zip
          .file("score.json")
          .async("string")
          .then((json) => {
            info.score = json;
            zip
              .file("midi.json")
              .async("string")
              .then((json) => {
                info.midi = json;
                callback(info);
              });
          });
      });
    }
  },

  //转换为MID文件
  CCMZmidToJson(input) {
    //const
    return 'error';
  }
}

module.exports = libCCMZ;