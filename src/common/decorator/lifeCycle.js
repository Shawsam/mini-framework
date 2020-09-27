import * as User from './common/utils/user';
const LIFE_CYCLE_MAP = ['ComponentWillMount', 'ComponentDidMount', 'ComponentDidShow'];

const lifeCycle = (lifecycle = 'ComponentDidMount')=>{
  if (LIFE_CYCLE_MAP.includes(lifecycle)) {
      return function(Component) {
          
        // 这里还可以通过redux来获取本地用户信息，在用户一次登录之后，其他需要鉴权的页面可以用判断跳过流程
        // @connect(({ user }) => ({
        //   userInfo: user.userInfo,
        // }))
        return class lifeCycleComponent extends Component {
          constructor(props) {
            super(props);
          }

          async componentWillMount() {
            if (super.componentWillMount) {
              if (lifecycle === LIFE_CYCLE_MAP[0]) {
                const res = await this.$beforeMount();
                console.log(res);
              }
              super.componentWillMount();
            }
          }

          async componentDidMount() {
            if (super.componentDidMount) {
              if (lifecycle === LIFE_CYCLE_MAP[1]) {
                const res = await this.$beforeMount();
                console.log(res);
              }
              super.componentDidMount();         
            }
          }
          
          //注入方法/重写-拦截方法/修改属性
          async componentDidShow() {
            if (super.componentDidShow) {
              if (lifecycle === LIFE_CYCLE_MAP[2]) {
                const res = await this.$beforeMount();
                console.log(res);
              } 
              super.componentDidShow();         
            }
          }

          $beforeMount = () => {
              return new Promise((resolve,reject)=>{
                  setTimeout(()=>{
                      resolve(`准备完毕, $_{lifecycle}`);
                  },3000)
              })
          }
        }
      }
  }else{
      console.warn(`传入的生命周期不存在, $_{lifecycle}`);
      return Component => Component;
  }
}

export default lifeCycle;
