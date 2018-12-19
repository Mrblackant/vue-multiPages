<template>
    <div id="app">
        <header>
            <!--            <div class="logo">
                  </div>-->
            <nav>
                <ul>
                    <li :class="{'active' :'dashboard'===showItem}">
                        <a @click="showToggle({'name': 'dashboard'})"><i class="iconfont icon-shenqinghezuojigouxi1"></i> 我的待办<span></span></a>
                        <ul>
                            <li :class="linkClick === 'dashboard' ? 'active':''">
                                <a @click="treeSwitch({'name': 'dashboard'})"><i class="iconfont icon-hezuojigouweihu"></i> 我的待办</a>
                            </li>
                        </ul>
                    </li>
                    <li v-for="(item) in routes" v-if="!item.hidden" :class="{'active' :item.name===showItem}">
                        <a @click="showToggle(item)"><i class="iconfont" :class="'icon-' + item.meta.icon"></i>{{item.meta.title}}<span></span></a>
                        <ul v-if="item.children">
                            <li v-for="i in item.children" v-if="!i.hidden" :class="linkClick === i.name? 'active':''">
                                <a href="#/" @click="treeSwitch(i)"><i class="iconfont" :class="'icon-' + i.meta.icon"></i>{{i.meta.title}}</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
        <main>
            <iframe v-bind:src="getPagePath" width="100%" v-bind:height="clientHeignt + 'px'" scrolling="auto" frameborder="0" id="external-frame"></iframe>
            <!--<keep-alive>-->
            <!--<router-view></router-view>-->
            <!--</keep-alive>-->
        </main>
    </div>
</template>
<script>
import { getRouter } from '../../api/dict'
import { feesRoutes } from '@/utils/newAddFeesRouter'
//    import {iFrameResize} from '@/'
export default {
    name: 'app',
    //  页面加载之前
    data() {
        return {
            clientHeignt: window.document.documentElement.clientHeight,
            showItem: "",
            linkClick: '',
            routes: [],
            //缓存页面路径
            page_path: sessionStorage.getItem('cachePath') ? sessionStorage.getItem('cachePath') : 'dashboard.html',
            //页面容器,用于存放需要跳转页面的路径
            page_list: {
                'index': 'dashboard.html',
                'dashboard': 'dashboard.html', // 首页待办
                'School': 'coop/schoolmanage.html', //院校维护
                'Detail': 'coop/schooldetail.html', //院校详情
                'SchoolEdit': 'coop/schooledit.html', //院校编辑
                'Partner': 'coop/coopseeapply.html', // 可选不可选申请
                'AddSchool': 'coop/schooladd.html', //添加院校
                'OrgMaintain': 'coop/orgmanage.html', //合作项目查询
                'OrgAdd': 'coop/orgadd.html', //新增机构
                'OrgEdit': 'coop/orgedit.html', // 编辑机构
                'StudyAbroadSearch': 'coop/schoolsearch.html', // 院校查询
                'CounselorSchoolDetail': 'coop/schoolsearchdetail.html', //顾问院校详情
                'Method': 'coop/applymethod.html', //新增申请
                'Manage': 'coop/applymanage.html', //申请查询
                'EditDirectSchool': 'coop/applyeditdirect.html', //编辑直接合作申请
                'EditParentOrg': 'coop/applyeditorg.html', //编辑机构合作
                'DiffContract': 'coop/contedit.html', //信息修正
                'RenewDirect': 'coop/renewdir.html', //续签直接合作
                //      'RenewDerive': 'coop/renewDerive.html',//续签衍生服务
                'RenewOrg': 'coop/reneworg.html', //续签机构合作
                'CoopApplyDetail': 'coop/applydetail.html', //申请详情
                'DirectPartnerSchool': 'coop/applyeditdirect.html', //编辑直接合作
                'ParentOrgDerive': 'coop/partnerderive.html', //新签衍生服务
                'ParentOrgSchool': 'coop/partnerorg.html', //新签机构合作
                'OrgSearch': 'coop/contmanage.html', //合作项目查询
                'Cooperation': 'coop/contdetail.html', //合作项目详情
                'ContractApprove': 'coop/contapprove.html', //冻结解冻审批
                'CooperationApply': 'coop/contseeapply.html', //冻结解冻申请
                'LXCOLADD': 'coop/schooladd.html', //新增院校
                'Supplement': 'coop/supplement.html', //补录
                'SupplementEditDri': 'coop/suppdirect.html', //补录直接合作
                'SupplementEditOrg': 'coop/supporg.html', //补录机构合作
                'SearchColDetail': 'coop/schoolsearchdetail.html', //顾问院校项目请

                'lxPushOldData': '',
                'SchoolManage': '',
                'application': ''
            }
        }
    },
    methods: {
        _initData() {
            getRouter().then(res => {
                if (res.status === 1) {
                    // console.log(res.data)
                    // console.log(feesRoutes)
                    this.routes = res.data.concat(feesRoutes)
                }
            })
        },
        showToggle: function(item) {
            if (this.showItem === item.name) {
                this.showItem = ''
            } else {
                this.showItem = item.name
            }
        },
        treeSwitch: function(item) {
            this.linkClick = item.name
            sessionStorage.setItem('cachePath', this.page_list[this.linkClick])
            if (this.page_path === this.page_list[this.linkClick]) {
                window.document.getElementById('external-frame').contentWindow.location.href = this.page_path
            }
        }
    },
    mounted() {
        this._initData()
        const that = this
        window.onresize = () => {
            return (() => {
                that.clientHeignt = window.document.documentElement.clientHeight
            })()
        }
    },
    computed: {
        //获取页面路径
        getPagePath() {
            if (this.page_list[this.linkClick]) {
                this.page_path = this.page_list[this.linkClick]
            } else {
                this.page_path = 'dashboard.html'
            }
            return this.page_path
        }
    }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.logo {
    height: 90px;
}

nav * {
    margin: 0;
    padding: 0;
}

nav li * {
    margin: 0;
    padding: 1px;
}

nav li {
    font-size: 15px;
}

nav a {
    color: #333;
    text-decoration: none;
    border-radius: 6px;
}

nav li a {
    display: block;
    text-indent: 30px;
    line-height: 40px;
    width: 100%;
    margin-bottom: 1px;
}

nav ul li a:hover {
    background-color: #f0f9fb;
    /*color: #fff*/
}

nav ul ul li a:hover {
    background-color: #31c3d6;
    /*color: #fff*/
}

nav ul li ul {
    display: none;
}

nav ul li.active ul {
    display: inline;
}

nav ul li a span {
    float: right;
    padding-right: 20px;
    color: #909399;
    font-size: 14px;
    /*position: absolute;*/
    top: 50%;
    right: 20px;
}

nav ul li a span:after {
    content: ">"
}

nav ul li.active a span:after {
    content: "∨"
}

nav ul li ul li.active a {
    background-color: #26c5d9;
    color: #fff
}

nav li ul li {
    padding-left: 18px;
    font-size: 14px;
}

header {
    float: left;
    width: 17%;
    min-width: 250px;
    position: absolute;
    height: 100%;
    /*margin:0 20px;*/
    background-color: white;
    box-shadow: 1px 2px 4px #b5bfc6
}

main {
    float: right;
    width: 83%;
    height: 100%;
    margin: 0px;
    padding: 0px;
}

body {
    height: 100%;
    width: 100%;
    margin: 0px;
    padding: 0px;
    overflow-y: hidden
}
</style>