<template>
  <div class="header">
    <div class="header-inner">
      <div class="nav">
        <a v-link="{name: 'index'}">抽奖</a>
        <a v-link="{name: 'res'}">获奖名单</a>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
  .header
    background: #f1f1f1
    border-bottom: 1px solid #e5e5e5
  .header-inner
    width: 960px
    margin: 0 auto
    height: 72px
    background: url("../assets/logo.png") left center no-repeat
  .nav
    float: right
    a 
      display: inline-block
      line-height: 72px
      margin-left: 40px
      text-decoration: none
      font-size: 18px
      color: #666
      &:hover
        color: #f04c71
</style>