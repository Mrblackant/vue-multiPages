<template>
  <div>
  <iframe v-bind:src="getPagePath" width="100%" height="100%" style="min-height: 768px" frameborder="0" id="external-frame" class="ifwapper"></iframe>
  </div>
</template>

<script>
    export default {
    name: 'mianIframe',
    data () {
      return {
        //缓存页面路径
        page_path: 'crm.html',
        //页面容器,用于存放需要跳转页面的路径  
        page_list: {
          //index
          about:'crm.html',
          'dashboard': 'dashboard.html',
          'School': 'coop/schoolmanage.html',
          'Detail': 'coop/schooldetail.html',
          'SchoolEdit': 'coop/schooledit.html',
          'Partner': 'coop/schoolpartner.html',
          'AddSchool': 'coop/chooladd.html',
          'OrgMaintain': 'coop/orgmaintain.html',
          'OrgAdd': 'coop/orgAdd.html',
          'OrgEdit': 'coop/orgEdit.html',
          'StudyAbroadSearch': 'coop/schoolsearch.html',
          'CounselorSchoolDetail': 'coop/counselorschooldetail.html',
          'Method': 'coop/applymethod.html',
          'Manage': 'coop/applymanage.html',
          'DirectPartnerSchool': 'coop/partnerdirect.html',
          'EditDirectSchool': 'coop/editDirectSchool.html',
          'DiffContract': 'coop/diffContract.html',
          'EditParentOrg': 'coop/editParentOrg.html',
          'RenewDirect': 'coop/renewDirect.html',
          'RenewDerive': 'coop/renewDerive.html',
          'RenewOrg': 'coop/renewOrg.html',
          'CoopApplyDetail': 'coop/coopApplyDetail.html',
          'ParentOrgDerive': 'coop/partnerderive.html',
          'ParentOrgSchool': 'coop/partnerorg.html',
          'OrgSearch': 'coop/orgmanage.html',
          'Cooperation': 'coop/cooperationdetail.html',
          'ContractApprove': 'coop/contractApprove.html',
          'CooperationApply': 'coop/cooperationapply.html',
          'LXCOLADD': 'coop/schooladd.html',
          'Supplement': 'Supplement.html',
          'SupplementEditDri': 'Supplement/editDri.html',
          'SupplementEditOrg': 'Supplement/editOrg.html',
          'SearchColDetail': 'coop/schoolsearchdetail.html'
        }
      }
    },
     
    computed: {
        //获取页面路径
        getPagePath (){
          console.log(this.page_path)
          if (this.page_list[this.$route.params.page_path]) {
            this.page_path = this.page_list[this.$route.params.page_path]
          }
          else if(this.$route.params.page_path == '!') {
            return this.page_path
          }
          else {
            this.page_path = this.page_list['about']
          }
          return this.page_path
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ifwapper{
  width: 100%;
  border: 1px solid red;
}
  iframe {
    padding: 3px;
  }
  @media screen and (max-width: 1000px) {
    iframe{
      min-height: 768px;
    }
  }
  @media screen and (max-width: 500px) {
    iframe{
      min-height: 400px;
    }
  }
</style>