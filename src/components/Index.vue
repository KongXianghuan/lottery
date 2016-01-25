<template>
  <div id="app">
    <div class="header">
      <div class="header-inner">
      </div>
    </div>
    <div class="main">
      <div class="lot">
        <div class="lot-wrap" :class="{ animating: 'animating' }">
          <div class="lot-box user" v-el:lotleft>
            <div track-by="$index" v-for="user in allusers" class="lot-item">
              <div class="lot-item-text">{{user}}</div>
            </div>
          </div>
          <div class="lot-box gift" v-el:lotright>
            <div track-by="$index" v-for="gift in allgifts" class="lot-item">
              <div class="lot-item-text" 
                :class="[
                  gift.length < 4 ? 'l' : '',
                  gift.length < 7 && gift.length > 4 ? 'm' : '',
                  gift.length > 7 ? 's' : '',
                ]">{{gift}}</div>
            </div>
          </div>
        </div>
        <div class="lot-start" @click="start"></div>
      </div>
      <div class="res" v-el:res>
        <div track-by="$index" v-for="resitem in res" class="res-item">
          {{resitem.u}} 抽中 {{resitem.g}}
        </div>
      </div>
      <div v-if="debug" class="btn-group">
        <button type="button" @click="resetData">reset</button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../lib/store'
import ls from '../mock/data'
import Velocity from 'velocity-animate'

export default {
  route: {
    data() {
      let debug = this.$route.query.debug
      this.debug = debug ? true : false
    }
  },
  ready() {
    this.init()
    this.$watch('res', this.handleResChange)
    this.$watch('round', this.handleRoundEnd)
  },
  data() {
    return {
      users: [],
      gifts: [],
      allusers: [],
      allgifts: [],
      tmpUsers: [],
      tmpGifts: [],
      amount: {},
      round: 0,
      roundAll: 2,
      roundEnd: true,
      r1: {},
      r2: {},
      res: [],
      ls: ls,
      animating: false,
      duration: 400,
      itemH: 146,
      total: 0,
      debug: false,
      timer: []
    }
  },
  computed: {
    roundLen: function() {
      return this.round == this.roundAll 
        ? this.total - Math.ceil(this.total/this.roundAll)*(this.roundAll-1)
        : Math.ceil(this.total/this.roundAll)
    }
  },
  methods: {
    resetData() {
      store.set('data', ls)
      this.init()
    },
    init() {
      let data = store.get('data')
      for (let key in data) {
        this.$set(key, data[key])
      }
      this.total = this.allusers.length
      this.allgifts.unshift('XXX')
      this.allusers.unshift('XXX')
      this.roundEnd = true
      this.timer = []
    },
    genArr(tar) {
      let arr = []
      let len = this.round == this.roundAll - 1
        ? this.total - Math.ceil(this.total/this.roundAll)*(this.roundAll-1)
        : Math.ceil(this.total/this.roundAll)
      for (let i = 0; i < len; i++) {
        let k = len - i
        let ran = this.ran(0, k)
        let g = tar.splice(ran, 1)[0]
        arr.push(g)
      }
      return arr
    },
    ran(start, end) {
      return parseInt(Math.random() * (end - start) + start)
    },
    updateLS(r) {
      let data = store.get('data')
      for (let k in this.$data) {
        data[k] = this.$data[k]
      }
      store.set('data', data)
    },
    start() {
      let self = this
      if (self.res.length == self.total || !self.roundEnd) return
      self.roundEnd = false
      if (self.tmpUsers.length == 0) {
        self.tmpUsers = self.genArr(self.users)
        self.tmpGifts = self.genArr(self.gifts)
      }
      let round = 'r' + self.round
      let u = self.tmpUsers.slice()
      let g = self.tmpGifts.slice()
      let len = u.length
      for (let i = 0; i < len; i++) {
        self.delayAni(u, g, round, i)
      }
    },
    updateLot(tar, text) {
      let self = this
      let tmp = self[tar]
      tmp.pop()
      tmp.push(text)
      self.$set(tar, tmp)
    },
    delayAni(u, g, round, i) {
      let self = this;
      let t = setTimeout(function() {
        self.updateLot('allusers', u[i])
        self.updateLot('allgifts', g[i])
        self.ani(function() {
          let res = { u: u[i], g: g[i] }
          let uIndex = self.tmpUsers.indexOf(u[i])
          let gIndex = self.tmpGifts.indexOf(g[i])
          self.res.push(res)
          self.tmpUsers.splice(uIndex, 1)
          self.tmpGifts.splice(gIndex, 1)
          self.amount[g[i]]--
          self.updateLS()
          if (self.tmpUsers.length == 0) {
            self.roundEnd = true
            self.round++
          }
          clearTimeout(self.timer[i])
        })
      }, i*(self.duration+1000))
    },
    ani(cb) {
      let self = this
      if (self.animating) return
      self.animating = true
      Velocity(self.$els.lotleft, {translateY: 0}, {duration: 0})
      Velocity(self.$els.lotright, {translateY: 0}, {duration: 0})
      Velocity(self.$els.lotleft, {
        translateY: -self.itemH*(self.total)
      }, {
        duration: self.duration
      })
      Velocity(self.$els.lotright, {
        translateY: -self.itemH*(self.total) 
      }, {
        duration: self.duration+200,
        complete() {
          if (typeof cb === 'function') {
            setTimeout(function() { cb() }, 200)
          }
          self.animating = false
        }
      })
    },
    handleResChange() {
      this.$els.res.scrollTop = this.$els.res.scrollHeight
    },
    handleRoundEnd() {
      if (this.round == 0) return
      let r = this.round
      alert('第'+r+'轮抽奖结束！')
    }
  }
}
</script>

<style lang="stylus">
*
  margin: 0
  padding: 0
body
  font-family: Helvetica, sans-serif;
.header
  background: #f1f1f1
  border-bottom: 1px solid #e5e5e5
.header-inner
  width: 960px
  margin: 0 auto
  height: 72px
  background: url("../assets/logo.png") left center no-repeat
.main
  width: 960px
  margin: 30px auto 0
  overflow: auto
.lot
  width: 533px
  height: 441px
  overflow: hidden
  background: url("../assets/machine.png") center no-repeat
  position: relative
  float: left

.lot-wrap
  position: absolute
  left: 56px
  top: 154px
  width: 356px
  height: 148px
  overflow: hidden
  background: #f04c71
  &.animating
    text-shadow: 0 0 50px #ccc

.lot-start
  width: 68px
  height: 240px
  position: absolute
  right: 0

.lot-box
  width: 177px
  position: absolute
  top: 0
  &:nth-child(1)
    left: 0
  &:nth-child(2)
    left: 177px
  &.gift .lot-item .lot-item-text
    &.s
      font-size: 28px
    &.m
      font-size: 32px
    &.l
      font-size: 40px
  .lot-item
    width: 177px
    text-align: center
    height: 146px
    line-height: 35px
    display: table
    .lot-item-text
      background: #fff
      text-align: center
      font-size: 40px
      display: table-cell
      vertical-align: middle
      line-height: 1.3
      border: 5px solid #f04c71

.res
  width: 300px
  height: 430px
  padding: 20px
  float: left
  border: 20px solid #f04c71
  border-radius: 20px
  overflow: scroll
  margin-left: 40px
  .res-item
    line-height: 30px

.btn-group
  button
    width: 100px
    height: 50px
    font-size: 24px
</style>
