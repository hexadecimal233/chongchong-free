const util = require('./utils');

const ccApi = {
    //获取OpernID
    async getOpernID(musicID) {
        const pattern1 = /(data-oid="(?:[^"\\]|(?:\\\\)|(?:\\\\)*\\.{1})*")/;
        const pattern2 = /\d{1,}/;
        const result = await util.httpget(`https://www.gangqinpu.com/cchtml/${musicID}.htm`, '', false, 'OpernID', false);
        const pat1 = result.match(pattern1)[0];
        if (pat1 == null) {
            console.log('OpernID找不到');
            return null;
        }
        const opernID = pat1.match(pattern2)[0];
        if (util.isDetailedOutput()) console.log(`OpernID为${opernID}`);
        return opernID;
    },

    //获取歌曲信息（json）
    getDetails(opernID) {
        const domain_str = 'https://www.gangqinpu.com/api';
        const getBalanceListApi = domain_str + '/home/user/getOpernDetail?';
        const url1 = `service_type=ccgq&platform=web-ccgq&service_uid=&service_key=&ccgq_uuid=&uid=&id=${opernID}`;
        const params = {
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.0.0 Safari/537.36"
            }
        }
        
        return util.httpget(getBalanceListApi+url1, params, false, '琴谱信息', false);
    }
}

module.exports = ccApi;

