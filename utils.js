const needle = require('needle');

const utilities = {
    promiseGet(url, params, raw, name, showResp) {
      if (url == '') throw new Error('url不能留空');
      if (this.isDetailedOutput()) console.log(`开始获取${name} (${url})`);
      return new Promise((resolve, reject) => {
          setTimeout( () => {
            needle.get(url, params,(error, response) => {
              if (!error && response.statusCode == 200) {
                if (this.isDetailedOutput()) {
                  if (showResp) console.log(`获取了${name}: ${response.body}`);
                  else console.log(`获取了${name}`);
                }
                raw ? resolve(response.raw) : resolve(response.body);
              } else {
                console.log(`无法获取${name}: `, error);
                reject(error);
              }
            });
          },100);
       });
    },

    //同步HTTP请求, 回调第一个参数是响应
    async httpget(url, params, raw, name, showResp) {
      let p = null;
      await this.promiseGet(url, params, raw, name, showResp)
        .then((res)=>{p = res;})
        .catch((err) => {throw err;});
      return p;
    },

    //获取布尔值中文
    //type=true : 是否 type=false : 真假
    booleanString(input, type) {
      return input ? type ? '是' : '真' : type ? '否' : '假';
    },
    
    //是否详细输出
    isDetailedOutput() {
      var args = require('minimist')(process.argv.slice(2));
      return args['d'] || args['@j*9'];
    }
}

module.exports = utilities;