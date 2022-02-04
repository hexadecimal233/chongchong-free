var needle = require('needle');

var utilities = {
    promiseDown(url, params, raw, name, showResp) {
        console.log(`开始下载${name} (${url})`);
        return new Promise((resolve, reject) => {
            setTimeout( () => {
              needle.get(url, params,(error, response) => {
                if (!error && response.statusCode == 200) {
                    if (showResp) console.log(`获取了${name}: ${response.body}`);
                    else console.log(`获取了${name}`);
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
      await this.promiseDown(url, params, raw, name, showResp).then((res)=>{p = res;}).catch((err) => {process.exit(1);});
      return p;
    },

    //获取布尔值中文
    //type=true : 是否 type=false : 真假
    booleanString(input, type){
      return input ? type ? '是' : '真' : type ? '否' : '假';
    }
}

module.exports = utilities;