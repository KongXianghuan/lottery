<template>
  <div>
    <navtop></navtop>
    <div class="pageRes">
       <div v-for="(k, v) in res" >
         <h1>{{k}}</h1>
         <div class="group">
           <span v-for="u in v">{{u}}</span>
         </div>
       </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  h1
    color: #444
    margin: 30px 0 10px
    font-weight: normal
    border-bottom: 1px solid #ccc
  .pageRes
    width: 960px
    margin: 20px auto
  .group
    margin-bottom: 50px
    span
      display: inline-block
      padding: 3px 18px 3px 0
      font-size: 20px
      width: 68px
</style>

<script>
  import store from '../lib/store'
  import Navtop from './Navtop.vue'
  export default {
    data() {
      return {
        res: {}
      }
    },
    route: {
      data() {
        let resArr = store.get('data')['res']
        let tmp = {}
        for (let i =0; i < resArr.length; i++) {
          let o = resArr[i]
          if (typeof tmp[o.g] == 'undefined') {
            tmp[o.g] = []
          }
          tmp[o.g].push(o.u)
        }
        this.res =  tmp
      }
    },
    components: { Navtop }
  }
</script>