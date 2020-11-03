import { observable } from 'mobx'

const userStore = observable({
	authorizeShow:false,
    registerShow:false,
    userInfo:{
        gender:0,
    	point:'--',
        level:'蝇量级',
        levelId:1,
        exp:0,
        avatarUrl:require('../../assets/images/avatar.png')
    },
	setUserInfo(userInfo){
		userInfo = { ...this.userInfo, ...userInfo }
		this.userInfo = userInfo;    
	},
    setAuthorizeShow(state){
    	this.authorizeShow = state;
    },
    setRegisterShow(state){
        this.registerShow = state;
    },
    get isAuthorized(){
    	return !!this.userInfo.nickName;
    },
    get isRegistered(){
        return !!this.userInfo.userId;
    }
})

export default userStore