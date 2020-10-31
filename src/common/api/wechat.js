import Taro  from '@tarojs/taro'
import { base } from '../../config'
import { httpPromise } from '../utils/httpPromise';
import log from '../utils/log';

const merId = 59;
const ENV = Taro.getEnv();
const preUrl = base.micvsDomain+'crm-web/wechat'; 
const activityCode = base.activityCode;
const _param = { version:base.version };
let openid,token,unionid,authInfo,userInfo,userId,nickName,cardNo,mobile,avatarUrl,point;

function getStorage(){
  unionid = Taro.getStorageSync('unionId');
  openid = Taro.getStorageSync('Pid');
  token = Taro.getStorageSync('token');
  userInfo = Taro.getStorageSync('userInfo');
  authInfo = Taro.getStorageSync('authInfo');
  userId = userInfo.userId;
  cardNo =  userInfo.cardNo;
  mobile = userInfo.mobile;
  nickName = userInfo.nickName||authInfo.nickName;
  avatarUrl = userInfo.avatarUrl||authInfo.nickName;
  point = userInfo.point||0;
}

//===========================================================================
//jsCode换取openid
export const jsCode2Openid = (code)=>{
    const url = preUrl + '/jsCode2Openid';
    const param = { ..._param, jscode:code };
    return httpPromise.get(url, param);
}

//token生成
export const getToken = ()=>{
    getStorage();
    const url = preUrl + '/getToken';
    const param = { ..._param, openid, unionId:unionid, userId };
    return httpPromise.get(url, param);
}

//toekn校验
export const judgeToken = ()=>{
    getStorage();
    const url = preUrl + '/judgeToken';
    const param = { ..._param, openid, token, userId };
    return httpPromise.get(url, param);
}

//解密数据
export const encryptedData = (encrypt,iv)=>{
    getStorage();
    const url = preUrl + '/encryptedData';
    let param = { ..._param, encryptedData:encrypt, iv, openid };
    return httpPromise.get(url, param);
}

//unionId获取用户信息
export const fetchUserInfoById= () => {
    getStorage();
    const url = preUrl + '/member/userInfo';
    const param = { ..._param, openid, unionid, name:nickName };
    if(!unionid) return  Promise.reject({errcode:-1000,msg:'未获取到unionid'})
    return httpPromise.get(url, param);
}

export const fetchUserInfoByMobile = (mobile) => {
    getStorage();
    const url = preUrl + '/member/userInfo';
    const param = { ..._param, name:nickName, idType:5, amount:mobile, openid }
    return httpPromise.get(url,param)
}

export const userRegister = ({mobile,gender,birth,shopId}) => {
    getStorage();
    const url = preUrl + '/member/registerUser';
    const param = { ..._param, name:nickName, unionid, acceptPic:avatarUrl, mobile, gender, birth, openid, shopId };
    !birth && delete param.birth
    !shopId && delete param.shopId
    return httpPromise.post(url, param);
}

export const userLogin = (mobile) => {
    getStorage();
    const url = preUrl + '/member/login';
    const param = { ..._param, unionid, openid, mobile };
    return httpPromise.post(url, param);
}

export const getActivateUrl = ()=>{
    getStorage();
    const url = preUrl + '/getActivateUrl';
    const param = { ..._param, openid, token, userId };
    return httpPromise.get(url, param, true);
}

export const openCard = (authCode, requestId)=>{
    getStorage();
    const url = preUrl + '/openCard';
    const param = { ..._param, authCode, requestId, openid, token, userId };
    console.log(param)
    return httpPromise.get(url, param);
}

//活动列表
export const fetchActlist = (pages) => {
    getStorage();
    const url = preUrl + '/main/activity/getList';
    const param = { ..._param,merId, openid,pageNum:pages, pageSize:10, token, userId };
    return httpPromise.post(url, param);
}
//获取最新版本
export const getVersion = (pages) => {
    getStorage();
    const url = preUrl + '/page/config/getVersion';
    const param = { ..._param,merId,openid,token, userId };
    return httpPromise.post(url, param);
}
//获取最新列表
export const versionList = (pages) => {
    getStorage();
    const url = preUrl + '/page/config/getList';
    const param = { ..._param,merId,openid,token,userId,indexCode:'index'};
    return httpPromise.post(url, param);
}

export const updateNotice = () => {
    getStorage();
    const url = preUrl + '/member/updateNotice';
    const param = { ..._param, userId, openid, token };
    return httpPromise.post(url, param);
}

export const fetchCouponExpiredSoon = () => {
    getStorage();
    const url = preUrl + '/coupon/couponExpiredSoon';
    const param = { ..._param, userId, openid, cardNo, token };
    return httpPromise.get(url, param);
}

export const getPointMess = () => {
    getStorage();
    const url = preUrl + '/member/getPointMess';
    const param = { ..._param, userId, openid, merId, point, token };
    return httpPromise.get(url, param);
}

export const getStoryList = () => {
    getStorage();
    const url = preUrl + '/store/storyList';
    const param = { ..._param,  merId, pageNo:1, pageSize:10 };
    return httpPromise.get(url, param);
}

export const getXlAct = () => {
    getStorage();
    const url = preUrl + '/xl/getActivity';
    const param = { ..._param,  merId, userId, openid, token};
    return httpPromise.get(url, param);
}

export const actSign = (xlId) => {
    getStorage();
    const url = preUrl + '/xl/sign';
    const param = { ..._param,  merId, userId, openid, token, xlId};
    return httpPromise.post(url, param);
}


export const getPageStyle = () => {
    getStorage();
    const url = preUrl + '/getPageStyle';
    const param = { ..._param, openid, merId, positionId:1 };
    return httpPromise.get(url, param);
}

export const getApiRate = () => {
    getStorage();
    const url = preUrl + '/getApiRate';
    const param = { ..._param, openid, merId, apiType:1 };
    return httpPromise.get(url, param);
}

export const fetchCouponCount = () => {
    getStorage();
    const url = preUrl + '/coupon/couponCount';
    const param = { ..._param, userId, openid, token, checkShop:0 };
    return httpPromise.get(url, param);
}

export const fetchBannerState = (posId) => {
    getStorage();
    const url = preUrl + '/popup/isPopup';
    const param = { ..._param, merId, posId, openid, token, userId };
    return httpPromise.get(url, param);
}

export const fetchAdBanner = (posId) => {
    getStorage();
    const url = preUrl + '/popup/popup';
    const param = { ..._param, merId, posId, openid, token, userId };
    return httpPromise.get(url, param);
}

export const fetchBannerList = (posIds) => {
    getStorage();
    const url = preUrl + '/banner/bannerList';
    const param = { ..._param, merId, posIds };
    return httpPromise.get(url, param);
}

export const fetchNoticeMessage = () => {
    getStorage();
    const url = preUrl + '/member/noticeMessage';
    const param = { ..._param, merId, channel:1, openid, token, userId, cardNo };
    return httpPromise.get(url, param);
}

export const editUserInfo = ({ gender, name, birth, pic, taskId }) => {
    getStorage();
    const url = preUrl + '/member/editUser';
    const param = { ..._param, userId, gender, name, birth, pic, openid, token, taskId, cardNo, unionId:unionid, };
    !taskId && delete param.taskId;
    !pic && delete param.pic;
    !birth && delete param.birth;
    return httpPromise.post(url, param, true);
}

export const fetchCouponListas = ({ status,kind, pageNo, pageSize=10, isTransfer=1, checkShop=0 }) => {
    getStorage();
    const url = preUrl + '/coupon/couponList';
    let param = { ..._param, userId, pageNo,kind,pageSize, status, openid, token, isTransfer, checkShop }; 
    if(status==2 || status==3){
        param = { ..._param, userId, pageNo, pageSize, status, openid, token, isTransfer, checkShop, rangeDate:90 }; 
    }    
    return httpPromise.get(url, param);
}
export const fetchCouponList = ({ status, pageNo, pageSize=10, isTransfer=1, checkShop=0 }) => {
    getStorage();
    const url = preUrl + '/coupon/couponList';
    let param = { ..._param, userId, pageNo, pageSize, status, openid, token, isTransfer, checkShop }; 
    if(status==2 || status==3){
        param = { ..._param, userId, pageNo, pageSize, status, openid, token, isTransfer, checkShop, rangeDate:90 }; 
    }    
    return httpPromise.get(url, param);
}

export const fetchCouponCountByKind = ()=>{
    getStorage();
    const url = preUrl + '/coupon/countByKind';
    const param = { ..._param, openid, userId, token, status:1, kinds:'1,2,3', checkShop:0, isTransfer:1}
    return httpPromise.get(url,param,true)
}

export const fetchShopCategory = () => {
    getStorage();
    const url = preUrl + '/goods/findCategory';
    const param = { ..._param, merId, classId:1, openid, token, userId };
    return httpPromise.get(url, param);
}

export const fetchExclusiveCategory = () => {
    getStorage();
    const url = preUrl + '/goods/findCategory';
    const param = { ..._param, merId, classId:2, openid, token, userId };
    return httpPromise.get(url, param);
}

export const fetchGoodsList = ({ categoryId, pageNo, pageSize=10 }) => {
    getStorage();
    const url = preUrl + '/goods/goodsList';
    const param = { ..._param, merId, userId, pageNo, pageSize, categoryId, openid, token };
    return httpPromise.get(url, param);
}

export const goodsExChange = (goodsId, points) => {
    getStorage();
    const url = preUrl + '/goods/exchange';
    const param = { ..._param, goodsId, points, num:1,  merId, userId, cardNo, openid, token, mobile};
    return httpPromise.post(url, param, true);
}

export const fetchTransLog = ({ pageNo, pageSize=10 })=>{
    getStorage();
    const url = preUrl + '/member/transLog';
    const param = { ..._param, userId, pageNo, pageSize, originTransCode:'A015', openid, token };
    return httpPromise.get(url, param);
}

export const getQrcode = ()=>{
    getStorage();
    const url = preUrl + '/card/qrCode';
    const param = { ..._param, cardNo, openid, token, userId };
    return httpPromise.get(url, param);
}


export const getImageCode = ()=>{
    getStorage();
    const url = preUrl + '/sms/getImageCode';
    return url+'?version='+base.version+'&openid='+openid+'&v='+Math.floor(Math.random()*1000);
}

export const sendCode = (mobile, imgCode)=>{
    getStorage();
    const url = preUrl + '/sms/sendCode';
    const param = { ..._param, openid, mobile, imgCode };
    return httpPromise.post(url, param, true);
}

export const checkCode = (mobile, smsCode)=>{
    getStorage();
    const url = preUrl + '/sms/checkCode';
    const param = { ..._param, openid, mobile, smsCode };
    return httpPromise.post(url, param, true);
}


export const couponAddShare = (couponNo) => {
    getStorage();
    const url = preUrl + '/coupon/couponAddShare';
    const param = { ..._param, openid, unionid:unionid, token, userId, couponNo, platform:2  };
    return httpPromise.get(url, param);
}

export const cancelShare = (couponNo, uCode) => {
    getStorage();
    const url = preUrl + '/coupon/cancelShare';
    const param = { ..._param, openid, token, userId, couponNo, uCode, platform:2  };
    return httpPromise.get(url, param);
}

export const couponGetShareCode = (couponNo) => {
    getStorage();
    const url = preUrl + '/coupon/shareUCode';
    const param = { ..._param, openid, token, userId, couponNo, platform:2  };
    return httpPromise.get(url, param);    
}

export const couponShareStatus = (couponNo, uCode) => {
    getStorage();
    const url = preUrl + '/coupon/shareStatus';
    const param = { ..._param, openid, token, userId, couponNo, uCode, platform:2  };
    return httpPromise.get(url, param);    
}

export const receiveCoupon = (couponNo, uCode) => {
    getStorage();
    const url = preUrl + '/coupon/receiveCoupon';
    const param = { ..._param, unionId:unionid, openid, token, userId, couponNo, uCode, platform:2  };
    return httpPromise.get(url, param);    
}

export const couponCheck = (couponNo) => {
    getStorage();
    const url = preUrl + '/coupon/checkPlatform';
    const param = { ..._param, unionId:unionid, openid, token, userId, couponNo, platform:2  };
    return httpPromise.get(url, param);    
}

export const currentOrderDetail = ({orderId, storeCode, orderDate})=>{
    getStorage();
    const url = preUrl+'/oc/ocCurrentOrderDetail';
    const param =  {  ..._param, token, userId, openid,  orderId, storeCode, orderDate, checkInvoice:1};
    return httpPromise.get(url, param);  
}

export const orderDetail = ({transLogSeq, orderNo, storeCode, transDate, transAmt, totalAmt})=>{
    getStorage();
    const url = preUrl+'/oc/newOcOrderDetail';
    const param =  {  ..._param, token, userId, openid,transLogSeq, orderNo, storeCode, transDate, transAmt, totalAmt};
    return httpPromise.get(url, param);  
}

export const crmOrderDetail = ({orderNo2})=>{
    getStorage();
    const url = preUrl+'/order/detail';
    const param =  {  ..._param, token, openid, userId, cardNo, unionid, mobile, orderNo2, userName:nickName };
    return httpPromise.get(url, param);  
}


export const getCurrentInvoiceUrl = ({ transAmt, storeCode, orderId, businessDay })=>{
    getStorage();
    const url = preUrl+'/oc/cuOrderGetInvoiceUrl';
    const param =  {  ..._param, token, openid, userId, transAmt, orderTransCode:'O001', storeCode, orderId, businessDay };
    return httpPromise.get(url, param, true);  
}

export const getInvoiceUrl = ({ orderLogSeq, transLogSeq, storeCode, orderId, businessDay })=>{
    getStorage();
    const url = preUrl+'/oc/newGetInvoiceUrl';
    const param =  {  ..._param, token, openid, userId, orderLogSeq, transLogSeq, storeCode, orderId, businessDay };
    return httpPromise.get(url, param, true);  
}

export const getEquityInvoiceUrl = ({ billId, businessDay })=>{
    getStorage();
    const url = preUrl+'/equity/getInvoiceUrl';
    const param =  {  ..._param, billId, businessDay, openid, token, userId };
    return httpPromise.get(url, param, true);  
}

export const checkExchangeCode = (code) => {
    getStorage();
    const url = preUrl + '/exchangeCode/valid';
    const param = { ..._param, openid, token, userId, code  };
    return httpPromise.post(url, param);
}

export const codeExchange = (code) => {
    getStorage();
    const url = preUrl + '/exchangeCode/exchange';
    const param = { ..._param, openid, token, userId, code  };
    return httpPromise.post(url, param);
}

export const fetchEquityList = (code) => {
    getStorage();
    const url = preUrl + '/member/equityInfo';
    const param = { ..._param, openid, token, userId, merId  };
    return httpPromise.post(url, param);
}

export const fetchEquityLog = ({ startDate, endDate, pageNo=1,pageSize=10}) => {
    getStorage();
    const url = preUrl + '/equity/list';
    const param = { ..._param, openid, token, userId, startDate, endDate,  pageNo, pageSize };
    return httpPromise.get(url, param);
}


export const fetchEquityDetail = (equityId) => {
    getStorage();
    const url = preUrl + '/equity/equityDetail';
    const param = { ..._param, openid, token, userId, equityId, cardNo  };
    return httpPromise.post(url, param);
}

export const useEquity = (equityId) => {
    getStorage();
    const url = preUrl + '/equity/useEquity';
    const param = { ..._param, openid, token, equityId, cardNo, userId, mobile  };
    return httpPromise.post(url, param);
}

export const cancelEquity = (billId) => {
    getStorage();
    const url = preUrl + '/equity/cancelBill';
    const param = { ..._param, openid, token, userId, billId, cardNo  };
    return httpPromise.post(url, param);
}

export const getCityList = () => {
    getStorage();
    const url = preUrl + '/store/getCityList';
    const param = { ..._param, status:'1,2,3' }
    return httpPromise.get(url,param);
}

export const getShopList = ({latitude,longitude,distance,cityCode='',keywords='',pageNo=1,pageSize=10}) => {
    getStorage();
    const url = preUrl + '/store/getList';
    const param = { ..._param,
        lat:latitude,
        lng:longitude,
        distance,
        cityCode,
        name: keywords,
        status:'1,2,3',
        pageNum: pageNo,
        pageSize,
        openid
    };
    return httpPromise.get(url, param);
}


export const getPayViewInfo = () => {
    getStorage();
    const url = preUrl + '/member/payView';
    const param = { ..._param, userId, openid, token };
    return httpPromise.get(url, param);
}

export const getOcOrderList= ({ pageNo, pageSize=10 }) => {
    getStorage();
    const url = preUrl + '/oc/ocOrderList';
    const param = { ..._param, mobile, openid, userId, cardNo, token, pageNo, pageSize };
    return httpPromise.get(url, param);
}

export const getTransLog= ({ pageNo, pageSize=10 }) => {
    getStorage();
    const url = preUrl + '/member/transLog';
    const param = { ..._param, orderChannel:'1600,1600005,1600204,0,1600403', userId, openid, token, pageNo, pageSize };
    return httpPromise.get(url, param);
}

export const getHisOrders= ({ pageNo, pageSize=10 }) => {
    getStorage();
    const url = preUrl + '/pt/hisOrders';
    const param = { ..._param, userId, openid, token, pageNo, pageSize };
    return httpPromise.get(url, param);
}

export const getTempList= (category) => {
    getStorage();
    const url = preUrl + '/templateMessage/getTempList';
    const param = { ..._param, openid, token, userId, category };
    return httpPromise.post(url, param);
}

export const addFormId= (category,type,templateId) => {
    getStorage();
    const url = preUrl + '/templateMessage/addFormId';
    const param = { ..._param,
         userId,
         unionid,
         openid,
         mobile,
         token,
         category,
         type,
         templateId:templateId.join(',')
    }
    return httpPromise.post(url,param,false)
}

export const fissionDetail= () => {
    getStorage();
    const url = preUrl + '/fission/main/getDetail';
    const param = { ..._param,
         activityCode:'1001',
         cardNo,
         merId,
         openid,
         userId:userId||'',
         token,
         userName:nickName,
         userUrl:avatarUrl
    }
    return httpPromise.get(url,param,false)
}


export const fissionActivate= (fissionLogId) => {
    getStorage();
    const url = preUrl + '/fission/main/activate';
    const param = { 
         ..._param,
         fissionLogId,
         merId,
         openid,
         userId,
         token
    }
    return httpPromise.get(url,param,false)
}

export const fissionAdierDetail= (fissionCode) => {
    getStorage();
    const url = preUrl + '/fission/aider/getDetail';
    const param = { 
         ..._param,
         fissionCode,
         merId,
         openid,
         userId:userId||'',
         token
    }
    return httpPromise.get(url,param,false)
}


export const fissionAiderInvite= (fissionCode) => {
    getStorage();
    const url = preUrl + '/fission/aider/invite';
    const param = { 
         ..._param,
         fissionCode,
         merId,
         openid,
         userId,
         token,
         userName:nickName,
         userUrl:avatarUrl
    }
    return httpPromise.get(url,param,false)
}

export const fissionAdierAid= (fissionCode) => {
    getStorage();
    const url = preUrl + '/fission/aider/aid';
    const param = { 
         ..._param,
         fissionCode,
         merId,
         openid,
         userId,
         cardNo,
         token,
         userName:nickName,
         userUrl:avatarUrl
    }
    return httpPromise.get(url,param,true)
}


export const fetchPointList = ({ status, startDate, endDate, pageNo, pageSize=10 }) => {
    getStorage();
    const originTransCode = status==1?'A017':'A036';
    const url = preUrl + '/member/transLog';
    const param = { ..._param, originTransCode, userId, openid, token, pageNo, pageSize };
    return httpPromise.get(url, param);
}

export const fetchTaskList = () => {
    getStorage();
    const url = preUrl + '/task/list';
    const param = { ..._param, userId, openid, token };
    return httpPromise.get(url, param);
}

export const receiveTask = ({taskId}) => {
    getStorage();
    const url = preUrl + '/task/receive';
    const param = { ..._param, userId, openid, token, unionId:unionid, cardNo, taskId };
    return httpPromise.post(url, param, true);
}

export const fetchTaskLog = ({status, pageNo, pageSize=10 }) => {
    getStorage();
    const url = preUrl + '/task/record';
    const param = { ..._param, userId, openid, token, status, pageNo, pageSize };
    return httpPromise.get(url, param);
}

export const getNewTaskStatus = ({ lastDate }) => {
    getStorage();
    const url = preUrl + '/task/hasNew';
    const param = { ..._param, userId, openid, token, lastDate };
    return httpPromise.get(url, param);
}

export const taskFinish = ({ taskId }) => {
    getStorage();
    const url = preUrl + '/task/finish';
    const param = { ..._param, userId, openid, unionId:unionid, token, cardNo, taskId };
    return httpPromise.post(url, param);
}


//下单的引导文案@米修
export const noticeForOc= () => {
    getStorage();
    const url = preUrl + '/task/noticeForOc';
    const param = { ..._param, userId, openid, token };
    return httpPromise.get(url, param);
}

export const userVisit = ({equipment,path,lat,lng}) =>{
    getStorage();
    const url = preUrl + '/visit';
    const param = { ..._param, userId, openid, token, unionId:unionid, equipment, path, lng, lat };
    return httpPromise.post(url, param);
}

//新版裂变接口
export const getFissileList = ({queryTimes, pageNo=1, pageSize=10}) =>{
    getStorage();
    const url = preUrl + '/fp/main/detail/get';
    const param = { ..._param, userId, openid, token, merId, activityCode, queryTimes, pageNo, pageSize };
    return httpPromise.get(url, param);
}


export const shareTypeAdd = () =>{
    getStorage();
    const url = preUrl + '/fp/main/log/add';
    const param = { ..._param, userId, openid, token, merId, activityCode, cardNo, userName:nickName, userUrl:avatarUrl };
    return httpPromise.post(url, param, true);
}

export const shareTypeUpdate = ({fpLogId,shareType}) =>{
    getStorage();
    const url = preUrl + '/fp/main/log/shareType/update';
    const param = { ..._param, userId, openid, token, fpLogId, shareType };
    return httpPromise.post(url, param, true);
}

export const shareDetail = ({activityCode,fissionCode}) =>{
    getStorage();
    const url = preUrl + '/fp/share/detail/get';
    const param = { ..._param, merId, activityCode, fissionCode };
    return httpPromise.get(url, param);
}


export const addFissileLog = ({fissionCode}) =>{
    getStorage();
    const url = preUrl + '/fp/aider/item/add';
    const param = { ..._param, userId, openid, token, merId, cardNo, fissionCode, userName:nickName, userUrl:avatarUrl };
    return httpPromise.post(url, param);
}

export const awardList = () =>{
    getStorage();
    const url = preUrl + '/fp/main/award/list';
    const param = { ..._param, userId, openid, token, merId, activityCode, cardNo };
    return httpPromise.post(url, param);
}

//拼团入口注册
export const  recordSource = ({teamId}) =>{
  getStorage();
  const url = preUrl + '/pt/recordSource';
  const param = { ..._param, openid, token, userId, teamId}
  return httpPromise.get(url,param);
}


//拼团开票
export const getGroupInvoiceUrl = ({ billId, businessDay })=>{
    getStorage();
    const url = preUrl+'/pt/getInvoiceUrl';
    const param =  {  ..._param, billId, businessDay, openid, token, userId };
    return httpPromise.get(url, param, true);  
}

