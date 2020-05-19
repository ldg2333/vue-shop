import Vue from 'vue'
import { Button,Form,FormItem,Input,Message} from 'element-ui'
 
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 导入弹框提示组件 (该组件需要全局挂载才能使用)
Vue.prototype.$message = Message
