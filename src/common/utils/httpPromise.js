import Taro from '@tarojs/taro';
import log from './log';

const taroRequest = (url,data,method,needLoad)=>{
    needLoad && Taro.showLoading({title:'加载中...',mask:true});
    return new Promise((resolve, reject) => {
        Taro.request({
            url: url,
            method: method,
            data: data,
            timeout: 7000,
            header: { "Content-Type": "application/x-www-form-urlencoded" }
        }).then(res=>{
            needLoad && Taro.hideLoading();
            if (res.statusCode == 200) {
                let resData = res.data;
                if(resData.errcode == 0){
                    resolve(resData);
                }else if(resData.errcode==100000){
                    log.error('接口参数异常：'+url)
                    log.error('请求参数：'+JSON.stringify(data))
                    reject({errcode:100000,msg:'参数异常'});
                }else{
                    reject(resData);
                }
            } else {
                log.error('接口调用失败：'+url)
                log.error('请求参数：'+JSON.stringify(data))
                reject({msg:'网络异常，请重试'});
            }
        }).catch(err=>{
            needLoad && Taro.hideLoading();
            log.error('接口调用超时：'+url)
            reject({msg:'网络异常，请重试'});
        })
    })
}
export const httpPromise = {
    get:(url,data,needLoad)=>taroRequest(url,data||{},'GET',needLoad),
    post:(url,data,needLoad)=>taroRequest(url,data||{},'POST',needLoad)
}

