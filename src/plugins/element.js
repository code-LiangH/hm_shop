import Vue from 'vue'
//以下可以合并
import { Button } from 'element-ui'
import {Form, FormItem} from 'element-ui'
import {Input} from 'element-ui'
import {Message} from "element-ui"   //需要通过原型链挂载
import {Container, Header, Main,Aside} from "element-ui"
import {Menu, Submenu, MenuItemGroup, MenuItem} from "element-ui"
import {Breadcrumb,BreadcrumbItem} from "element-ui"
import {Card} from "element-ui"
import {Row} from "element-ui"
import {Col} from "element-ui"
import {Table} from "element-ui"
import {TableColumn} from "element-ui"
import {Switch} from "element-ui"
import {Tooltip} from "element-ui"
import {Pagination} from "element-ui"
import {Dialog} from "element-ui"
import {MessageBox} from "element-ui"
import {Tag} from "element-ui"
import {Tree} from "element-ui"
import {Select} from "element-ui"
import {Option} from "element-ui"
import {Cascader} from "element-ui"

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
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)


Vue.prototype.$message = Message   //message可以是任意字母
Vue.prototype.$confirm = MessageBox.confirm