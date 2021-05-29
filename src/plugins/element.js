import Vue from 'vue'
//以下可以合并
import { Button } from 'element-ui'
import {Form, FormItem} from 'element-ui'
import {Input} from 'element-ui'
import {Message} from "element-ui"   //需要通过原型链挂载

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message   //message可以是任意字母
