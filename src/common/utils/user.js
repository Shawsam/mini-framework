import Taro from '@tarojs/taro';
import Api from '../api';
import log from './log';
const Env = Taro.getEnv();


//获取第三方Id
export const LoginAndGetPid = ()=>{
      return new Promise((resolve,reject) =>{
        if(Env === 'ALIPAY'){
            my.getAuthCode({
              scopes: ['auth_base'],
              success: res => {
                console.log(res);
                if(typeof res.authCode === 'string'){
                    Api.autCodeGetUuid(res.authCode).then(res=>{
                        let uuid = res.data;
                        Taro.setStorageSync('Pid', uuid);
                        resolve(res);
                    }).catch(err=>{
                        reject(err)
                    });
                }else{
                    console.warn('请求成功，授权失败')
                    reject({msg:'授权失败，请重试'})
                }  
              },
              fail: err=>{
                  console.warn('授权请求失败')
                  console.log(err)
                  if(err.authErrorScope){
                      reject({msg:err.authErrorScope.scope})
                  }else{
                      reject({msg:'网络异常，请重试'})
                  }            
              }
            })
        }else if(Env === 'WEAPP'){
            wx.login({
                timeout:5000,
                success:(res) => {
                  if (res) {
                      //请求服务器，获取openId, unionId
                      Api.jsCode2Openid(res.code).then(res => {
                          console.log('jsCode2Openid--获取openId成功');
                          let { openId, unionid } = res.data;
                          Taro.setStorageSync('Pid', openId);
                          resolve(res);
                      }).catch(err=>{
                          console.log('jsCode2Openid--获取openId失败,'+JSON.stringify(err));
                          reject(err)
                      })
                  } else {
                      console.log('wx.login--微信登陆失败',JSON.stringify(err));
                      reject({msg:'调用微信登录接口失败，请重试'})
                  }
                },
                fail:(err) => { 
                    console.log('wx.login--微信登陆超时,'+JSON.stringify(err));
                    reject({msg:'调用微信登录接口超时，请重试'})
                }
            })
        }
      })
    }

//获取授权状态
export const  getAuthorizeState = ()=>{
    return new Promise((resolve, reject) => {
        if(Env === 'WEB'){
            let userInfo = { avatar:'', nickName:'' }
            resolve(userInfo)
        }else if(Env === 'ALIPAY'){
            my.getSetting({
              success: res => {
                console.log(res.authSetting);
                if (res.authSetting['userInfo']) {
                    console.log('getSetting--用户已授权');
                    my.getOpenUserInfo({
                      success: (res) => {
                          let userInfo = JSON.parse(res.response).response;
                          Taro.setStorageSync('$userInfo', userInfo);
                          resolve(userInfo)
                      },
                      fail: (err) => {
                          console.log(err);
                          reject({msg:err})
                      }
                    });
                }else{
                    console.log('getSetting--用户未授权');
                    resolve(null)
                }
              },
              fail: err=>{
                  console.log('getSetting--获取授权状态失败');
                  reject({msg:'获取授权状态失败，请重试'})
              }
            })
        }else if(Env === 'WEAPP'){
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        console.log('wx.getSetting--用户已授权');
                        wx.getUserInfo({
                          success: (res) => {
                              let { userInfo } = res;
                              Taro.setStorageSync('$userInfo', userInfo);
                              console.log('wx.getSetting--获取授权数据成功');
                              resolve(userInfo);
                          },
                          fail: (err) => {
                              console.log('wx.getSetting--获取授权数据失败');
                              reject({msg:err})
                          }
                        });
                    }else{
                        console.log('wx.getUserInfo--用户未授权');
                        resolve(null)
                    }
                },
                fail: err=>{
                    console.log('wx.getSetting-获取授权状态失败');
                    reject({msg:'获取授权状态失败，请重试'})
                }
            })
        }
    })
}

//更新token
export const updateToken = ()=>{
    return new Promise((resolve, reject) => {
        if(Env === 'WEB'){
            resolve({data:{userOpenId:123456}})
        }else{
            let token = Taro.getStorageSync('token');
            if(token){
                //校验token是否过期
                Api.judgeToken().then(res=>{
                    console.log('judgeToken--token有效');
                    resolve(res)
                }).catch(err=>{
                    console.log('judgeToken--token无效');
                    getToken().then(res=>{
                        resolve(res)
                    }).catch(err=>{
                        reject(err)
                    });
       
                })
            }else{
                console.log('token不存在')
                getToken().then(res=>{
                    resolve(res)
                }).catch(err=>{
                    reject(err)
                });
            }
        }
    })
}

//生成token
export const getToken = ()=>{
      return new Promise((resolve, reject) => {
          if(Env === 'ALIPAY'){
              my.getAuthCode({
                scopes: ['auth_base'],
                success: res => {
                  if(typeof res.authCode === 'string'){
                      Api.autCodeGetUuid(res.authCode).then(res=>{
                          console.log('getToken--生成token成功');
                          Taro.setStorageSync('token', res.data.token);
                          resolve(res);
                      }).catch(err=>{
                          console.log('getToken--生成token失败');
                          reject(err);
                      });
                  }else{
                      console.log('请求成功，授权失败');
                      reject({msg:'授权失败，请重试'});
                  }  
                },
                fail: err=>{
                    console.log('授权请求失败');
                    if(err.authErrorScope){
                        reject({msg:err.authErrorScope.scope});
                    }else{
                        reject({msg:'网络异常，请重试'});
                    }            
                }
              })
          }else if( Env === 'WEAPP'){
              Api.getToken().then(res=>{
                  console.log('getToken--生成token成功');
                  Taro.setStorageSync('token', res.data.token);
                  resolve(res);
              }).catch(err=>{
                  console.log('getToken--生成token失败');
                  reject(err);
              })
          }
      })
}

//获取用户信息(unionId & openid)
export const fetchUserInfoById = ()=>{
    return new Promise((resolve, reject) => {
        Api.fetchUserInfoById().then(res=>{
            console.log('fetchUserInfoById--获取用户信息成功');
            let userInfo = res.data;
            resolve(userInfo);
        }).catch(err=>{
            console.log('fetchUserInfoById--获取用户信息失败');
            reject(err);
        })
    })
}

//领卡
export const cardRegister = (url,mobile)=>{
    return new Promise((resolve, reject) => {
        my.getAuthCode({
          scopes: ['auth_user'],
          success: res => {
            if(typeof res.authCode === 'string'){
                Api.autCodeGetUuid(res.authCode).then(res=>{
                    Taro.setStorageSync('userSecret', res.data);
                    my.addCardAuth({
                        url:url,
                        success: (res) => {
                            if(res.result){
                              let { auth_code, request_id } = res.result;
                              Api.openCard(auth_code, request_id, mobile).then(res=>{
                                  console.log('开卡成功');
                                  resolve();
                              }).catch(err=>{
                                  reject(err);
                              })
                            }else{
                                console.log(res);
                                reject({msg:'开卡失败，请重试'});
                            }
                        },
                        fail: (err) => {
                            console.log(err);
                            reject({msg:'开卡失败，请重试'});
                        },
                    });
                }).catch(err=>{
                    reject(err)
                });
            }else{
                console.log('请求成功，授权失败')
                reject({msg:'授权失败，请重试'})
            }  
          },
          fail: err=>{
              console.log('授权请求失败')
              if(err.authErrorScope){
                  reject({msg:err.authErrorScope.scope})
              }else{
                  reject({msg:'网络异常，请重试'})
              }            
          }
        })
    })
}

//获取第三方Id及token  token升级后废弃
export const getPidAndToken = () =>{
    return new Promise((resolve, reject) => {
        if(Env === 'WEB'){
            resolve({data:{userOpenId:123456}})
        }else{
            let userSecret = Taro.getStorageSync('userSecret');
            if(userSecret){
                //校验token是否过期
                Api.judgeToken().then(res=>{
                    console.log('judgeToken--token有效')
                    resolve(res)
                }).catch(err=>{
                    console.log('judgeToken--token无效')
                    LoginAndGetPid().then(res=>{
                        resolve(res)
                    }).catch(err=>{
                        reject(err)
                    });
       
                })
            }else{
                console.log('token不存在')
                LoginAndGetPid().then(res=>{
                    resolve(res)
                }).catch(err=>{
                    reject(err)
                });
            }
        }
    })
}
