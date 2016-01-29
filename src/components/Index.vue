<template>
  <div id="app">
    <navtop></navtop>
    <div class="main">
      <div class="lot">
        <h1>荔枝FM2015年会抽奖</h1>
        <div class="lot-wrap">
          <div class="lot-box user" v-el:lotleft>
            <div track-by="$index" v-for="user in allusers" class="lot-item">
              <div class="lot-item-text">{{user}}</div>
            </div>
          </div>
          <div class="lot-box gift" v-el:lotright>
            <div track-by="$index" v-for="gift in allgifts" class="lot-item">
              <div class="lot-item-text" 
                :class="[
                  gift.length <= 4 ? 'l' : '',
                  gift.length <= 7 && gift.length > 4 ? 'm' : '',
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
import Navtop from './Navtop'

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
      res: [],
      ls: ls,
      duration: 300,
      itemH: 166,
      total: 0,
      debug: false
    }
  },
  computed: {
    roundLen: function() {
      return this.round == this.roundAll 
        ? this.total - Math.ceil(this.total/this.roundAll)*(this.roundAll-1)
        : Math.ceil(this.total/this.roundAll)
    }
  },
  components: {
    Navtop
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
      if (this.allusers.indexOf('XXX') < 0) {
        this.allgifts.unshift('XXX')
        this.allusers.unshift('XXX')
      }
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
      if (self.round == 2 || !self.roundEnd || (self.users.length == 0 && self.tmpUsers.length == 0)) return
      self.roundEnd = false
      if (self.tmpUsers.length == 0) {
        self.tmpUsers = self.genArr(self.users)
        self.tmpGifts = self.genArr(self.gifts)
      }
      self.animate()
    },
    animate() {
      let self = this
      let res = { u: self.tmpUsers[0], g: self.tmpGifts[0] }
      self.updateLot('allusers', self.tmpUsers[0])
      self.updateLot('allgifts', self.tmpGifts[0])
      Velocity(self.$els.lotleft, {translateY: 0}, {duration: 0})
      Velocity(self.$els.lotright, {translateY: 0}, {duration: 0})
      Velocity(self.$els.lotleft, {
        translateY: -33033
      }, {
        duration: self.duration
      })
      Velocity(self.$els.lotright, {
        translateY: - 33033
      }, {
        duration: self.duration + 100,
        complete() {
          self.tmpUsers.splice(0, 1)
          self.tmpGifts.splice(0, 1)
          self.res.push(res)
          self.amount[res.g]--
          self.updateLS()
          if (self.tmpUsers.length == 0) {
            self.round++
            self.roundEnd = true
            return
          }
          setTimeout(function() { self.animate() }, 500)
        }
      })
    },
    updateLot(tar, text) {
      let self = this
      let tmp = self[tar]
      tmp.pop()
      tmp.push(text)
      self.$set(tar, tmp)
    },
    handleResChange() {
      this.$els.res.scrollTop = this.$els.res.scrollHeight
    },
    handleRoundEnd() {
      if (this.round == 0) return
      let r = this.round
      console.log(this.res)
      setTimeout(function() {
        alert('第'+r+'轮抽奖结束！')
      }, 500)
    }
  }
}
</script>

<style lang="stylus">
*
  margin: 0
  padding: 0
body
  font-family: "Microsoft Yahei", Helvetica, Arial, FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", sans-serif
.main
  width: 960px
  margin: 30px auto 0
  overflow: auto
.lot
  margin-top: 80px
  width: 630px
  height: 485px
  background: url("../assets/machine.png") center no-repeat
  background-size: 100% auto
  position: relative
  float: left
  h1
    text-align: center
    text-indent: -60px
    font-size: 48px
    margin-top: -74px
    color: #333

.lot-wrap
  position: absolute
  left: 66px
  top: 164px
  width: 420px
  height: 175px
  overflow: hidden
  background: #f04c71

.lot-start
  width: 68px
  height: 240px
  position: absolute
  right: 0

.lot-box
  width: 210px
  position: absolute
  top: 0
  &:nth-child(1)
    left: 4px
  &:nth-child(2)
    left: 208px
  &.gift .lot-item .lot-item-text
    &.s
      font-size: 30px
    &.m
      font-size: 34px
    &.l
      font-size: 44px
  .lot-item
    width: 210px
    text-align: center
    height: 166px
    line-height: 35px
    display: table
    .lot-item-text
      background: #fff
      text-align: center
      font-size: 48px
      display: table-cell
      vertical-align: middle
      line-height: 1.3
      border: 10px solid #f04c71
      word-break: break-all

.res
  width: 240px
  height: 550px
  padding: 12px 10px
  float: right
  border: 12px solid #f04c71
  border-radius: 20px
  overflow: scroll
  margin-left: 40px
  font-size: 16px
  .res-item
    line-height: 20px
    margin: 10px 0

.btn-group
  button
    width: 100px
    height: 50px
    font-size: 24px
</style>
