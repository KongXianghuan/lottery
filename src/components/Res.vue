<template>
  <div class="pageRes">
     <div v-for="(k, v) in res" >
       {{k}}：{{v}}
     </div>
  </div>
</template>

<script>
  import store from '../lib/store'
  export default {
    data() {
      let resArr = store.get('data')['res']
      return {
        resArr: resArr
      }
    },
    computed: {
      res() {
        let tmp = {}
        for (let i =0; i < this.resArr.length; i++) {
          let o = this.resArr[i]
          if (typeof tmp[o.g] == 'undefined') {
            tmp[o.g] = []
          }
          tmp[o.g].push(o.u)
        }
        return tmp
      }
    }
  }
</script>