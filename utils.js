const needle = require('needle');

const utilities = {
    promiseGet(url, params, raw, name, showResp) {
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
                console.log(`无法获取${name}: `, error, response.statusCode);
                reject(error);
              }
            });
          },200);
       });
    },

    //同步HTTP请求, 回调第一个参数是响应
    async httpget(url, params, raw, name, showResp) {
      let p = null;
      await this.promiseGet(url, params, raw, name, showResp)
        .then((res)=>{p = res;})
        .catch((err) => {process.exit(1);});
      return p;
    },

    //获取布尔值中文
    //type=true : 是否 type=false : 真假
    booleanString(input, type) {
      return input ? type ? '是' : '真' : type ? '否' : '假';
    },
    isDetailedOutput() {
      return require('minimist')(process.argv.slice(2))['d'];
    }
}

module.exports = utilities;