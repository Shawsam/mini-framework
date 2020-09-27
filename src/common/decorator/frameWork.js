import Taro, { Component } from '@tarojs/taro';
import { inject, observer } from '@tarojs/mobx';
import * as User from '../utils/user';
const errMap = [100124, 1001241, 100130];
let isIndex;

//userInfoCached 是否从缓存中读取会员信息
const frameWork = (userInfoCached=true) => (Component) =>
    @inject('userStore')
    @observer 
    class frameWorkComponent extends Component {
        //注入componentDidMount
        componentDidMount(){
            console.error('页面加载完毕');
            console.log('====执行函数componentDidMount====');
            isIndex = Taro.getCurrentPages().length == 1;
            let openId = Taro.getStorageSync('openId');
            if(openId){
                console.error('缓存中有openId');
                this.openIdReady();
                let authInfo = Taro.getStorageSync('authInfo');
                if(authInfo){
                    console.error('缓存中有授权信息');
                    this.props.userStore.setUserInfo(authInfo);                //同步数据
                    if(isIndex){
                        console.error('获取用户信息后渲染页面')
                        this.fetchUserInfoById();
                    }else{
                        console.error('直接渲染页面')
                        this.pageRender();
                    }
                }else{
                    console.error('缓存中无授权信息,需要授权');
                    this.setState({isLoading:false});
                }
            }else{
                console.error('缓存中无openId');
                User.LoginAndGetPid().then(res=>{
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
                this.userInfoReady(userInfo);
            }else{
                User.fetchUserInfoById().then(userInfo=>{
                    let { pic, name } = userInfo;
                    let { avatarUrl, nickName } = Taro.getStorageSync('authInfo');
                    userInfo.avatarUrl = pic?pic:avatarUrl;
                    userInfo.nickName = name?name:nickName;
                    Taro.setStorageSync('userInfo', userInfo);
                    Taro.setStorageSync('cardNo', userInfo.cardNo);
                    this.userInfoReady(userInfo);                  
                }).catch(err=>{
                    if(errMap.includes(err.errcode)){
                        this.userInfoUnReady(err);                      //未注册-未登录-禁用
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

        //openId已获取(请求页面只需openId的接口)
        openIdReady(){
            console.log('====执行函数openIdReady====');
            if(super.openIdReady){
                super.openIdReady();
            }else{
                console.warn('页面未定义方法处理openId已获取--openIdReady');
            }
        }

        //已获取到会员信息(缓存中，或请求用户信息完毕)
        userInfoReady(userInfo){
            console.log('====执行函数userInfoReady====');
            this.props.userStore.setUserInfo(userInfo);         //同步数据
            if(super.userInfoReady){
                super.userInfoReady(userInfo);
            }else{
                console.log('页面未定义方法处理已获取到会员信息--userInfoReady');
                console.log('默认调用pageRender方法')
                this.pageRender();
            }
        }

        //未获取到会员信息（请求用户信息完毕）
        userInfoUnReady(){
            this.setState({isLoading:false});
            console.log('====执行函数userInfoUnReady====');
            if(super.userInfoUnReady){
                super.userInfoUnReady();
            }else{
                console.warn('页面未定义方法处理未获取到会员信息--userInfoUnReady');
            }
        }

        //页面渲染
        pageRender(){
            console.log('====执行函数pageRender====');
            User.updateToken().then(res=>{
                if(super.pageRender){
                    super.pageRender();
                }else{
                    console.warn('页面未定义方法-pageRender');
                    this.setState({isLoading:false});
                }            
            }).catch(err=>{
                console.log(err);
                if(err.errcode==-1000){
                    this.fetchUserInfoById();
                }else{
                    Taro.showModal({  content:err.msg||'内部错误',
                                      showCancel:false,
                                      success:()=>{
                                          this.fetchUserInfoById()
                                      }
                                  })
                }              
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
                    let isAuthorized = this.props.userStore.isAuthorized;
                    if(isAuthorized){
                        resolve();
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
