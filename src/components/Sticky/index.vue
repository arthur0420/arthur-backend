<template>
  <div  class="sticky" :style="{height:height+'px',zIndex:zIndex}">
    <div :class="className" :style="{top:stickyTop+'px',zIndex:zIndex,position:position,width:width,height:height+'px'}">
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sticky',
  props: {
    stickyTop: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 1
    },
    className: {
      type: String
    }
  },
  data() {
    return {
      active: false,
      position: '',
      currentTop: '',
      width: undefined,
      height: undefined,
      child: null,
      stickyHeight: 0
    }
  },
  mounted() {
    this.height = this.$el.getBoundingClientRect().height
    window.addEventListener('scroll', this.handleScroll)
  },
  activated() {
    this.handleScroll()
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    sticky() {
      if (this.active) {
        return
      }
      this.position = 'fixed'
      this.active = true
      this.width = this.width + 'px'
    },
    reset() {
      if (!this.active) {
        return
      }
      this.position = ''
      this.width = 'auto'
      this.active = false
    },
    handleScroll() {
      this.width = this.$el.getBoundingClientRect().width
      const offsetTop = this.$el.getBoundingClientRect().top
      if (offsetTop <= this.stickyTop) {
        this.sticky()
        return
      }
      this.reset()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.sticky {
   -webkit-transition: position .6s ease;
    background: -webkit-gradient(linear,left top,right top,from(#20b6f9),color-stop(0,#20b6f9),color-stop(100%,#2178f1),to(#2178f1));
    background: linear-gradient(90deg,#20b6f9,#20b6f9 0,#2178f1 100%,#2178f1 0);
    height: 50px;
    line-height: 50px;
    padding-right: 20px;
    position: relative;
    text-align: right;
    transition: position .6s ease;
    width: 100%;
    margin-bottom: 10px;
}
</style>
