import Taro, { Component } from '@tarojs/taro';
import { inject, observer } from '@tarojs/mobx';
import * as User from '../utils/user';
const errMap = [-1000,-1001,'100124','1001241','100130'];
let isIndex;

//userInfoCached 是否从缓存中读取会员信息
const frameWork = ({userInfoCached=true,loadToAuthorize=false}) => (Component) =>
    @inject('userStore')
    @observer 
    class frameWorkComponent extends Component {
        //注入componentDidMount
        componentDidMount(){
            console.error('页面加载完毕');
            console.log('====执行函数componentDidMount====');
            isIndex = Taro.getCurrentPages().length == 1;
            let Pid = Taro.getStorageSync('Pid');
            let authInfo = Taro.getStorageSync('authInfo');
            if(Pid){
                super.PidReady && super.PidReady();                           //无需授权的接口数据渲染
                if(authInfo){
                    this.props.userStore.setUserInfo(authInfo);                //同步用户数据
                    if(isIndex){
                        console.error('当前页面为入口页-获取用户信息后渲染页面')
                        this.fetchUserInfoById();
                    }else{
                        console.error('当前页面非入口页-直接渲染页面')
                        this.userInfoReady();
                    }
                }else{
                    console.error('用户未授权');
                    this.setState({isLoading:false}); 
                    loadToAuthorize && this.props.userStore.setAuthorizeShow(true);                         
                }
            }else{
                console.error('缓存中无Pid');
                User.getToken().then(res=>{
                    this.componentDidMount();      
                }).catch(err=>{
                    Taro.showModal({  content:err.msg||'内部错误',
                                      showCancel:false,
                                      success:()=>{
                                          this.componentDidMount();
                                      }
                                    })
                })
            }
        }

        //注入函数 fetchUserInfoById
        fetchUserInfoById(){
            let userInfo = Taro.getStorageSync('userInfo');
            if(userInfo && userInfoCached){
                this.props.userStore.setUserInfo(userInfo);              //同步用户数据
                this.userInfoReady();                                    //渲染页面
            }else{
                User.fetchUserInfoById().then(userInfo=>{
                    let { pic, name } = userInfo;
                    let { avatarUrl, nickName } = Taro.getStorageSync('authInfo');
                    userInfo.avatarUrl = pic?pic:avatarUrl;
                    userInfo.nickName = name?name:nickName;
                    Taro.setStorageSync('userInfo', userInfo);
                    Taro.setStorageSync('cardNo', userInfo.cardNo);
                    this.props.userStore.setAuthorizeShow(false);       //关闭用户授权
                    this.props.userStore.setUserInfo(userInfo);         //同步用户数据
                    this.userInfoReady();                               //渲染页面                 
                }).catch(err=>{
                    let code = err.errcode;
                    if(errMap.includes(code)){
                        this.userInfoUnReady(code);                      //未注册-未登录-禁用
                    }else{
                        Taro.showModal({  content:err.msg||'内部错误',
                            showCancel:false,
                            success:()=>{
                                this.fetchUserInfoById();
                            }
                        })
                    }
                    
                })
            }
        }

        //未获取到会员信息（请求用户信息完毕，用户未注册-未登录-禁用）
        userInfoUnReady(code){
            console.log('====执行函数userInfoUnReady====');
            if(super.userInfoUnReady){
                super.userInfoUnReady(code);
            }else{
                console.warn('页面未定义方法处理未获取到会员信息--userInfoUnReady');
                this.setState({isLoading:false}); 
                switch(true){
                    case code == -1000:  this.props.userStore.setAuthorizeShow(true); break;
                    case code == 100124:  this.props.userStore.setRegisterShow(true); break;
                }
            }
        }

        //已经获取到用户信息（页面渲染）
        userInfoReady(){
            console.log('====执行函数userInfoReady====');
            User.updateToken().then(res=>{
                if(super.userInfoReady){
                    super.userInfoReady();
                }else{
                    console.warn('页面未定义方法-userInfoReady');
                    this.setState({isLoading:false});
                }            
            }).catch(err=>{
                console.log(err);
                Taro.showModal({  content:err.msg||'内部错误',
                                  showCancel:false,
                                  success:()=>{
                                      this.fetchUserInfoById()
                                  }
                              })       
            })
        }

        formatNumber(n){  n = n.toString();  return n[1] ? n : '0' + n  };

        //打开页面
        openPage(url,e){
            e.stopPropagation();
            this.interceptShowAuthorize().then(()=>{
              Taro.navigateTo({url})
            }).catch(err=>{
              console.log(err);
            })
        }
        
        //返回
        Return(){
            if(isIndex){
                Taro.switchTab({url:'/pages/index/index'});
            }else{
                Taro.navigateBack();
            }
        }
        //页面分享
        onShareAppMessage() {
            if(super.onShareAppMessage){
                super.onShareAppMessage();
            }else{
                return User.shareMessage();
            }
        }
        //授权拦截
        interceptShowAuthorize(){
            try{
                return new Promise((resolve,reject)=>{
                    let { isAuthorized, isRegistered } = this.props.userStore;
                    if(isAuthorized){
                        if(isRegistered){
                            resolve();
                        }else{
                            this.props.userStore.setRegisterShow(true);
                        }                        
                    }else{
                        this.props.userStore.setAuthorizeShow(true);  
                    }
                })
            }catch(err){
                console.log(err)
            }
        }
        
    }

export default frameWork;
