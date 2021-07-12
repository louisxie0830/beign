<template>
  <div :class="{ 'is-left-wrap': isLeft }">
    <div class="left-list" v-show="isLeft && !isLeftBig">
      <a-spin :spinning="spinningLeft">
        <ul class="left-list-ul">
          <div
            v-for="(item, index) in leftListData"
            :key="index"
            class="list-line-show"
            :class="{
              'list-line-no':
                index === leftListData.length - 1 ||
                (!nameMap[item.address] && index === leftListData.length - 2 && !item.registrar)
            }"
          >
            <li v-if="nameMap[item.address] || (!nameMap[item.address] && item.registrar)">
              <div class="time">{{ item.time }}</div>
              <span class="boll middle-shape"></span>
              <span class="line middle-shape"></span>
              <div class="info" v-if="item.registrar">
                <p>Signed By: {{ $t('Index.exporters') }}</p>
                <span v-if="item.registrar">
                  {{ item.registrar }}
                  <span><a-icon type="check"/></span>
                </span>
              </div>
              <div class="info" v-else>
                <div class="customs" v-if="nameMap[item.address].role.name === 'CUSTOMS'">
                  {{ nameMap[item.address].company.companyName }}({{
                    $t('entityRoles')[nameMap[item.address].role.name]
                  }}) {{ nameMap[item.address].employeeId }} - {{ $t('shipment.chainActions')[item.action] }}
                </div>
                <template v-else>
                  <p>Signed By: {{ $t('entityRoles')[nameMap[item.address].role.name] }}</p>
                  <span>
                    {{ nameMap[item.address].company.companyName }} <span><a-icon type="check"/></span>
                  </span>
                </template>
              </div>
            </li>
          </div>
        </ul>
      </a-spin>
    </div>
    <div class="canvas-pdf-wrap" :class="{ 'is-left': isLeft, 'is-left-big': isLeftBig }">
      <a-spin :spinning="spinning">
        <!-- <p style="text-align: center;" v-show="currentPage && numPages">{{ currentPage }}/{{ numPages }}</p> -->
        <span
          class="page-icon pdf-prev"
          :class="{ 'full-height full-height-prev': fullHeight }"
          v-show="showPrePage && numPages > 1"
          @click="prevousPage()"
        >
          <a-icon type="up-square" />
        </span>
        <span
          class="page-icon pdf-next"
          :class="{ 'full-height full-height-next': fullHeight }"
          v-show="showNextPage && numPages > 1"
          @click="nextPage()"
        >
          <a-icon type="down-square" />
        </span>
        <div
          ref="myContainer"
          @click.stop="onPdfClick()"
          class="container"
          :class="{ 'pdf-border': border }"
          :style="{ height: fullHeight ? '100%' : containerHeight + 'px' }"
        >
          <canvas class="viewer-canvas" ref="mypdf"></canvas>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
import PDFJS from 'pdfjs-dist'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'Pdf',
  props: {
    startPage: {
      type: [String, Number],
      default: 'all'
    },
    border: {
      type: Boolean,
      default: true
    },
    isLeft: {
      type: Boolean,
      default: false
    },
    fullHeight: {
      type: Boolean,
      default: false
    },
    viewerWidth: {
      type: Number,
      default: 500
    },
    viewerHeight: {
      type: Number,
      default: 500
    },
    preloadPage: {
      type: Number,
      default: 5
    },
    type: {
      type: String,
      default: ''
    },
    fileHash: {
      type: String,
      default: ''
    },
    fileSize: {
      type: Number,
      default: 0
    },
    source: {
      type: [String, Uint8Array],
      default: ''
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      lang: state => state.i18n.lang
    })
  },
  watch: {
    source: {
      handler: function (newVal, oldVal) {
        // watch it
        this.source = newVal
        // console.log('newVal: ', newVal)
        if (this.source) {
          this.print()
          this.currentPage = 1
        }
      }
    }
    // currentPage: {
    //   handler: function (newVal, oldVal) {
    //     this.renderByPage(this.currentPage)
    //   }
    // }
  },
  data () {
    return {
      src: null,
      numPages: undefined,
      currentPage: 1,
      pageHeight: 0,
      pdfReader: null,
      resizeTimer: null,
      doc: null,
      isFirst: false,
      showPrePage: false,
      showNextPage: false,
      containerHeight: 100,
      spinning: false,
      leftListData: [],
      nameMap: {},
      spinningLeft: false,
      isLeftBig: false
    }
  },
  methods: {
    // onScroll() {
    //   this.pageHeight = this.$refs.mypdf[0].clientHeight
    //   let scrollHeight = this.$refs.myContainer.scrollHeight
    //   let scrollTop = this.$refs.myContainer.scrollTop
    //   if (this.resizeTimer) {
    //     clearTimeout(this.resizeTimer)
    //   }
    //   this.resizeTimer = setTimeout(() => {
    //     $(this.$refs.controlPanel).css('top', scrollTop)
    //     if (this.pageHeight > 0) {
    //       let _currenPage = Math.floor(scrollTop / this.pageHeight)
    //       // alert(_currenPage);
    //       this.currentPage = _currenPage + 1
    //     }

    //     if (Math.floor(this.$refs.myContainer.offsetHeight + scrollTop) == scrollHeight) {
    //       this.currentPage = this.numPages
    //     }
    //   }, 100)
    // },
    onPdfClick: function () {
      if (this.isLeft) {
        this.isLeftBig = !this.isLeftBig
      }
      this.$emit('getBigger')
    },
    printPdf () {
      console.log('printPdf')
      // PDFPrintService(this.doc)
    },
    nextPage () {
      // const index = 0
      let _currentPage = this.currentPage

      if (_currentPage < this.numPages) {
        _currentPage = _currentPage + 1
      } else {
        // this.$message.info('没有下一页了')
        this.$message.info('no next page')
        return
      }
      this.currentPage = _currentPage
      this.renderOne(_currentPage)
      // if (this.$refs.mypdf.length === this.numPages) {
      //   console.log(this.$refs.mypdf[_currentPage - 1].offsetTop)
      //   $(this.$refs.myContainer).scrollTop(this.$refs.mypdf[_currentPage - 1].offsetTop)
      // }
    },
    prevousPage () {
      let _currentPage = this.currentPage
      if (_currentPage > 1) {
        _currentPage--
      } else {
        // this.$message.info('没有上一页了')
        this.$message.info('no prev page')
        return
      }
      this.currentPage = _currentPage
      this.renderOne(_currentPage)
      // if (this.$refs.mypdf.length === this.numPages) {
      //   console.log(this.$refs.mypdf[_currentPage - 1].offsetTop)
      //   $(this.$refs.myContainer).scrollTop(this.$refs.mypdf[_currentPage - 1].offsetTop)
      // }
    },
    computeHeight (viewportHeight, viewportWidth, fixedWidth) {
      const rate = viewportHeight / viewportWidth
      return fixedWidth * rate
    },

    renderByPage (pageNum, isRerneder) {
      // 从第一页开始渲染
      for (let i = 0; i < this.preloadPage; i++) {
        const p = pageNum + i
        if (p > this.numPages) {
          break
        }
        this.renderOne(p)
      }
    },
    renderAll () {
      // 根据pdf的页码渲染出所有的页面
      for (let i = 1; i <= this.numPages; i++) {
        this.renderByPage(i, false)
      }
    },
    renderOne (num) {
      const p = num || 1 // 默认渲染第一页
      this.spinning = true
      this.doc
        .getPage(p)
        .then(page => {
          const viewport = page.getViewport(2.0)
          var canvas = this.$refs.mypdf // [p - 1]
          canvas.height = viewport.height
          canvas.width = viewport.width
          this.containerHeight = this.computeHeight(viewport.height, viewport.width, this.viewerWidth)
          // if (canvas.$isLoad !== true) {
          page
            .render({
              canvasContext: canvas.getContext('2d'),
              viewport: viewport
            })
            .promise.then(() => {
              this.spinning = false
            })
          // canvas.$isLoad = true
          if (p < this.numPages) {
            this.showNextPage = true
          } else {
            this.showNextPage = false
          }
          if (p > 1) {
            this.showPrePage = true
          } else {
            this.showPrePage = false
          }

          // }
        })
        .catch(err => {
          this.$emit('handleError', err)
          this.spinning = true
          console.log(err)
        })
    },
    print () {
      // 请求chain信息
      if (this.isLeft) {
        this.spinningLeft = true
        this.$store.dispatch('getDocumentInfo', { fileHash: this.fileHash }).then(res => {
          const address = []
          res.map(item => {
            item.time = moment(Number(item.time)).format('YYYY/MM/DD HH:mm:ss')
            item.address = item.address.toLowerCase()
            address.push(item.address)
            return item
          })
          // console.log('this.$store.dispatch', res)
          this.leftListData = res.reverse()
          this.$store
            .dispatch('getAddressName', { address: [...new Set(address)].join(',') })
            .then(({ data }) => {
              const map = {}
              data.map(item => {
                map[item.ethAddress.toLowerCase()] = item
              })
              this.nameMap = map
            })
            .then(() => {
              this.$store
                .dispatch('requestOTBInfo', { fileHash: this.fileHash, fileSize: this.fileSize })
                .then(({ data }) => {
                  if (data) {
                    data.time = moment(data.time * 1000).format('YYYY/MM/DD HH:mm:ss')
                    this.leftListData.push(data)
                  }
                })
                .catch(err => {
                  console.log('err', err)
                })
                .finally(() => {
                  this.spinningLeft = false
                })
            })
        })
      }
      // 得到一个pdf对象 赋值给this.doc 渲染出所有pdf页面
      const baseUrl = process.env.VUE_APP_API_BASE_URL
      const token = this.token.replace('JWT ', '')
      const isCreated = this.type === 'detail'
      if (this.source === '') {
        return
      }
      let data = null
      if (typeof this.source === 'string') {
        data = `${baseUrl}/document/preview?fileKey=${this.source}&accessToken=${token}&isCreated=${isCreated}`
      } else {
        data = this.source
      }
      this.spinning = true
      PDFJS.getDocument(data)
        .promise.then(pdf => {
          // you can now use *pdf* here
          this.doc = pdf
          this.numPages = pdf.numPages
          // this.renderAll();
          if (typeof this.startPage === 'string' && this.startPage.toUpperCase() === 'ALL') {
            // this.renderAll()
            this.renderOne()
          } else if (typeof this.startPage === 'number' && this.startPage <= this.numPages) {
            this.currentPage = this.startPage
            this.renderByPage(this.currentPage, false)
          }
        })
        .catch(err => {
          // this.$message.error('预览失败')
          this.$message.error('preview failed')
          this.$emit('handleError', err)
          this.spinning = false
          console.log('err', err)
        })
    }
  },
  created () {
    this.isFirst = false
    this.print()
  }
}
</script>

<style scoped lang="less">
.control-bar {
  position: absolute;
  opacity: 0.5;
  text-align: center;
  background: #bbb;
  top: 0px;
  left: 0px;
}

.container {
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
  width: 100%;
}
.pdf-border {
  border: 1px solid #ddd;
}

.viewer-canvas {
  display: inline-block;
  width: 100%;
}

.control-bar-middle {
  line-height: 20px;
  vertical-align: middle;
}

.control-bar-cursor {
  line-height: 20px;
  vertical-align: middle;
  cursor: pointer;
}

.bold {
  font-weight: bold;
}

.pdf-prev {
  bottom: calc(10% + 20px);
}
.pdf-next {
  bottom: calc(10% + 0px);
}
.page-icon {
  z-index: 9;
  position: absolute;
  right: 0;
  cursor: pointer;
  font-size: 20px;
}
.full-height {
  position: fixed;
  right: calc(5% + 2px);
}
.pdf-next:hover,
.pdf-prev:hover {
  color: #999;
}
.canvas-pdf-wrap {
  padding: 0 20px;
  position: relative;
}
.is-left {
  width: 53%;
  float: right;
  padding: 0 10px;
  cursor: zoom-in;
}
.is-left-big {
  width: 100%;
  cursor: zoom-out;
}
.left-list {
  width: 47%;
  float: left;
}
.is-left-wrap {
  overflow: hidden;
}
.left-list-ul {
  width: 95%;
  overflow: auto;
  padding: 0;
  margin-top: 60px;
  margin-left: 5%;
  li {
    width: 100%;
    list-style: none;
    position: relative;
    height: 100px;
    display: flex;
  }
  .middle-shape {
    position: absolute;
    left: 150px;
    top: 22px;
  }
  .boll {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #f5a623;
  }
  .line {
    height: 100px;
    width: 1px;
    background: #f5a623;
    left: 160px;
    display: none;
  }
  .list-line-show {
    .line {
      display: block;
    }
  }
  .list-line-no {
    .line {
      display: none;
    }
  }
  .time {
    vertical-align: top;
    margin-top: 22px;
    width: 139px;
    min-width: 139px;
    margin-right: 40px;
  }
  .info {
    color: #094beb;
    .customs {
      padding-top: 21px;
      color: #666;
    }
    p {
      font-size: 10px;
      margin: 0;
    }
    > span {
      border: 1px solid #ddd;
      line-height: 25px;
      display: inline-block;
      padding-left: 5px;
      height: 25px;
      width: 190px;
      text-overflow: ellipsis;
      overflow: hidden;
      position: relative;
      > span {
        position: absolute;
        top: 0;
        right: 0;
        display: inline-block;
        color: #fff;
        background: #68b310;
        text-align: center;
        height: 25px;
        width: 25px;
      }
    }
  }
}
</style>
