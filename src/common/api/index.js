import * as wechat from './wechat';
import * as alipay from './alipay';
import Taro  from '@tarojs/taro';
const ENV = Taro.getEnv();

let API;
switch(true){
    case ENV === 'ALIPAY': 
                        API = alipay;
                        break;
    case ENV === 'WEAPP': 
              API = wechat;
              break;
}

export default API;
