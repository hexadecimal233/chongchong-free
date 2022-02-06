const JSZip = require('jszip');
const util = require('./utils');
var MidiWriter = require('midi-writer-js');

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

  //解析CCMZ文件，来自Controller.js
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
  writeMIDI(input,outputFile) {
    //初始化音轨
    var tracks = new Array();
    for (t in input['tracks']) {
      var trackOrig = input['tracks'][parseInt(t)];
      var currTrack = new MidiWriter.Track();
      //乐器是钢琴
      currTrack.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
      //名字
      var name = trackOrig['name'] != '' ? trackOrig['name'] : 'Unamned';
      currTrack.addTrackName(name)
      tracks.push(currTrack);
    }

    //速度和节拍
    for(t in input['tempos']) {
      var tempo = input['tempos'][parseInt(t)];
      for (_t in tracks) {
        var track = tracks[parseInt(_t)];
        track.setTempo(Math.round(60000000 / tempo['tempo'] * 4), tempo['tick']);
      }
    }

    for(b in input['beatInfos']) {
      var beat = input['beatInfos'][parseInt(b)];
      for (t in tracks) {
        var track = tracks[parseInt(t)];
        currTrack.setTimeSignature(beat['beats'], beat['beatsUnit'], beat['tick']);
      }
    }

    //添加note
    for(e in input['events']) {
      var event = input['events'][parseInt(e)];
      if (event['duration'] == 0 || !event['staff']) {
        continue;
      }
      var note = new MidiWriter.NoteEvent({
        velocity: 80,
        pitch: event['event'],
        duration: "T" + event['duration'],
        startTick: event['tick'],
      });

      var trackID = event['staff'] - 1;
      tracks[trackID].addEvent(note);
    }


    //写出
    console.log('开始写出MIDI文件');
    var write = new MidiWriter.Writer(tracks);
    require('fs').writeFileSync(outputFile, write.buildFile());
    console.log('成功写出MIDI文件');
  }
}

//MIDI类

class Event {
  tick;//时间
  duration;//持续时长
  track;//音轨序号
  event;//按键
  finger;//手指
  note;//未知
  part;//未知
  repeatIndex;//重复次数
  staff;//未知
  measure;//所在小节号
  elem_ids;//未知
  meas_start_tick;//小节开始时间
  id;//未知
}

class Measure {
  duration;//小节时长
  note_ticks;//每个音符出现时间
  measure;//小节号
}

class TempoChange {
  tempo;//速度
  tick;//时间
}

class Track {
  channel;//未知
  name;//名称
  program;//未知
}

class BeatChange {
  beats;//拍子
  beatsUnit;//拍子
  tick;//时间
}

class MIDI {
  ver;//版本号
  leftHandTrack;//低音音轨
  rightHandTrack;//高音音轨
  roughProgress;//未知
  beats;//拍号
  beatsUnit;//拍号
  beatInfos;//变拍子
  tempos;//变速
  tracks;//音轨
  measures;//小节
  measureInfos;//未知
  lyrics;//歌词
  events;//midi的event
}

module.exports = libCCMZ;