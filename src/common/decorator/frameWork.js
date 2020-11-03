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
        componentDidMount(){
            isIndex = Taro.getCurrentPages().length == 1;
            let Pid = Taro.getStorageSync('Pid');
            let authInfo = Taro.getStorageSync('authInfo');
            if(Pid){
                super.PidReady && super.PidReady();                           //无需授权的接口数据渲染
                if(authInfo){
                    this.props.userStore.setUserInfo(authInfo);                //同步用户数据
                    if(isIndex){
                        this.fetchUserInfoById();
                    }else{
                        this.userInfoReady();
                    }
                }else{
                    this.setState({isLoading:false}); 
                    loadToAuthorize && this.props.userStore.setAuthorizeShow(true);                         
                }
            }else{
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
                    if(userInfo.dataHabInfo && userInfo.dataHabInfo.membership){
                        userInfo.exp = userInfo.dataHabInfo.membership.exp;
                        userInfo.level = userInfo.dataHabInfo.membership.level.name;
                        userInfo.levelId = userInfo.dataHabInfo.membership.level.id
                    }
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

        userInfoUnReady(code){
            if(super.userInfoUnReady){
                super.userInfoUnReady(code);
            }else{
                this.setState({isLoading:false}); 
                switch(true){
                    case code == -1000:  this.props.userStore.setAuthorizeShow(true); break;
                    case code == 100124:  this.props.userStore.setRegisterShow(true); break;
                }
            }
        }


        userInfoReady(){
            User.updateToken().then(res=>{
                if(super.userInfoReady){
                    super.userInfoReady();
                }else{
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
