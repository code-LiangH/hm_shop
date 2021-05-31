import Vue from 'vue'
//以下可以合并
import { Button } from 'element-ui'
import {Form, FormItem} from 'element-ui'
import {Input} from 'element-ui'
import {Message} from "element-ui"   //需要通过原型链挂载
import {Container, Header, Main,Aside} from "element-ui"
import {Menu, Submenu, MenuItemGroup, MenuItem} from "element-ui"

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)


Vue.prototype.$message = Message   //message可以是任意字母
