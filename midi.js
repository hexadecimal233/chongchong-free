class BeatChange {
    beats;
    beatsUnit;
    tick;
}

class TempoChange {
    tempo;
    tick;
}

class Track {
    channel = 0;
    name = "";
    program = 0;
}
class Measure {
    
}

class MIDI {
    //通常固定
    ver = 1;
    rightHandTrack = 0;
    roughProgress = false;
    beats = 4;
    beatsUnit = 4;
    leftHandTrack = 1;
    measureInfos = [];
    lyrics = [];
    //主要信息
    tempos = [];//速度改变
    tracks = [];//音轨
    measures;//小节
    events;
    beatInfos = [];//拍号改变
}