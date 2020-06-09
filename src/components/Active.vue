<template>
  <div>
    <div class="header">
      <div class="gacha">
        <div class="happy" :class="{ play: rollplayActive }"></div>
        <div
          class="btn "
          @click="handleRoll"
          :class="{ active: rollBtnActive, disabled: times == 0 }"
        ></div>
        <div class="egg " :class="[luckyEgg]" v-if="luckyEgg"></div>
      </div>
      <div class="record">
        <transition-group class="up" name="list">
          <div
            class="lottery"
            v-for="(item, index) in people"
            :key="item.id"
            v-show="index === currentIndex"
          >
            <img class="avatar" :src="item.avatar" alt="头像" />
            <div class="word">恭喜 {{ item.name }} 获得 {{ item.prize }}</div>
          </div>
        </transition-group>
      </div>
    </div>

    <div class="mask" v-if="showDialog">
      <div class="diglog">
        <div class="top"></div>
        <div class="close" @click="handleClose"></div>
        <div class="center" :class="[luckyEgg]"></div>
        <div class="bottom" :class="[luckyEgg]"></div>
        <!-- 星星太多了，就弄了一个 -->
        <div class="star"></div> 

        <div class="card">
          <div class="prize">
            {{ prizeArr[prizeIndex].prize }}
          </div>
          <div class="tag">
            <span class="icon"></span>
            <div class="sub">{{ prizeArr[prizeIndex].label }}</div>
          </div>
        </div>
        <div
          class="btn"
          :class="[{ active: prizeBtnActive }, prizeBtnClass]"
          v-if="prizeBtnClass && dialogShowBtn"
          @click="handleGet"
        ></div>
      </div>
    </div>

    <div class="main">
      <div class="remain">
        <div class="chance" :class="[chance]"></div>
      </div>
      <div class="bell"></div>
      <div class="buy-class" @click="handleBuyTimes">
        <div class="buy"></div>
        <div class="icon"></div>
      </div>
      <div class="prize">
        <div class="my"></div>
        <div class="top"></div>
        <div class="center">
          <div class="items">
            <div class="item" v-for="(item, index) in prizes" :key="index">
              <div class="time">{{ item.date }}</div>
              <div class="gongxi">恭喜你获得</div>
              <div class="thing">{{ item.prize }}</div>
            </div>
          </div>
        </div>
        <div class="address"></div>
        <div class="bottom"></div>
      </div>

      <div class="rule">
        <div class="top"></div>
        <div class="title"></div>
        <div class="center">
          <div class="items">
            <div class="item">
              <div class="no no1"></div>
              <div class="word">
                已购买暑假或者秋季系统班课的用户，完成购买后可立刻参与抽奖，中奖率100%。
              </div>
            </div>
            <div class="item">
              <div class="no no2"></div>
              <div class="word">
                抽奖数由订单数决定，暑秋联报算2个订单。
              </div>
            </div>
            <div class="item">
              <div class="no no3"></div>
              <div class="word">
                如有退款，则对应的抽奖机会和对应的奖品一律无效。
              </div>
            </div>
            <div class="item">
              <div class="no no4"></div>
              <div class="word">
                所有的奖品，将在4月15号统一发货。
              </div>
            </div>
          </div>
        </div>
        <div class="bottom"></div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { stopBodyScroll, randomProbability } from '../utils/utils'

// 扭蛋颜色列表
let eggColors = ['blue', 'red', 'green', 'yellow']

export default {
  name: 'Active',
  data() {
    return {
      times: null, // 抽奖次数
      remainTimes: null, // 抽奖次数
      showDialog: false, //中奖弹窗
      rollBtnActive: false,
      rollplayActive: false,
      luckyEgg: '',
      timer: null,
      currentIndex: 0, // 轮播的标记
      prizeIndex: null, // 抽奖抽中的下标
      prizes: [], // 历史抽奖记录
      prizeBtnActive: false, //开奖按钮
      dialogShowBtn: false, //是否展示按钮
      prizeArr: [
        {
          prize: '鱼饼888个',
          label: '企鹅辅导花样礼品随心兑',
        },
        {
          prize: '鱼饼2019个',
          label: '企鹅辅导花样礼品随心兑',
        },
        {
          prize: '5Q币',
          label: 'Q币将发到下方填写的QQ号中',
        },
        {
          prize: '15Q币',
          label: 'Q币将发到下方填写的QQ号中',
        },
        {
          prize: '10Q币',
          label: 'Q币将发到下方填写的QQ号中',
        },
        {
          prize: '腾讯视频会员（1个月）',
          label: '请联系辅导老师或客服获取会员兑换码',
        },
        {
          prize: '怪奇鹅卡通笔（2支）',
          label: '多动笔，勤记录，知识点掌握更牢固',
        },
      ],
      people: [
        {
          avatar: 'https://via.placeholder.com/300',
          name: '孙笑川',
          prize: '鱼饼2019个',
          id: 1,
        },
        {
          avatar: 'https://via.placeholder.com/300',
          name: '苏珊',
          prize: '腾讯视频会员（1个月）',
          id: 2,
        },
        {
          avatar: 'https://via.placeholder.com/300',
          name: '乔治123',
          prize: '10Q币',
          id: 3,
        },
        {
          avatar: 'https://via.placeholder.com/300',
          name: '佩奇',
          prize: '10Q币',
          id: 4,
        },
      ],
    }
  },
  computed: {
    chance() {
      return `chance${this.times}`
    },
    prizeBtnClass() {
      if ([2, 3, 4].includes(this.prizeIndex)) {
        return 'q'
      }
      if ([6].includes(this.prizeIndex)) {
        return 'pencil'
      }
      return ''
    },
  },

  created() {
    let times = localStorage.getItem('times')
    console.log(times)
    if (times === 'null' || times === null) {
      localStorage.setItem('times', 6)
      this.times = 6
    } else {
      this.times = times
    }
    let remainTimes = localStorage.getItem('remainTimes')
    if (remainTimes === 'null' || remainTimes === null) {
      localStorage.setItem('remainTimes', 6)
      this.remainTimes = 6
    } else {
      this.remainTimes = remainTimes
    }

    let prizes = localStorage.getItem('prizes')
    if (prizes && prizes !== 'null') {
      this.prizes = JSON.parse(prizes)
    }
  },
  mounted() {
    // 自动开始滚动
    this.$nextTick(() => {
      this.timer = setInterval(() => {
        this.autoPlay()
      }, 3000)
    })
  },
  watch: {
    times(val) {
      localStorage.setItem('times', val)
    },
    remainTimes(val) {
      localStorage.setItem('remainTimes', val)
    },
  },

  methods: {
    // 自动播放中奖信息
    autoPlay() {
      this.currentIndex++
      if (this.currentIndex > this.people.length - 1) {
        this.currentIndex = 0
      }
    },
    // 扭蛋的随机颜色
    randomEggColor() {
      return eggColors[Math.floor(Math.random() * eggColors.length)]
    },
    // 抽奖按钮的更换
    handleRoll: debounce(function() {
      if (this.times < 1) {
        return
      }
      this.rollBtnActive = true
      setTimeout(() => {
        this.rollBtnActive = false
        this.playBall()
      }, 300)
    }, 400),
    // 扭蛋机的搅动
    playBall() {
      this.rollplayActive = true
      setTimeout(() => {
        this.rollplayActive = false
        this.eggDown()
      }, 2000)
    },
    // 抽奖结果扭蛋下落
    eggDown() {
      // 决定扭蛋的颜色
      this.luckyEgg = this.randomEggColor()
      this.times--
      this.draw()

      setTimeout(() => {
        this.showDialog = true
        stopBodyScroll(true)
        setTimeout(() => {
          this.dialogShowBtn = true
        }, 5000)
      }, 2100)
    },
    // 关闭抽奖结果弹窗
    handleClose() {
      // 存到localStorage里面的数据，只有在关闭弹窗的hook才最好，（可能导致弹窗直接刷新，没有存摇奖信息的问题）因为不是发请求的，做在其他里面都不完美。
      let date = new Date()

      this.prizes.push({
        date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
        prize: this.prizeArr[this.prizeIndex].prize,
      })

      stopBodyScroll(false)

      localStorage.setItem('prizes', JSON.stringify(this.prizes))

      this.luckyEgg = ''
      this.showDialog = false
      this.prizeIndex = null
      this.dialogShowBtn = false
    },
    // 购买抽奖机会
    handleBuyTimes() {
      if (this.remainTimes < 1 || this.times === 6) {
        return alert('对不起，已经超过上限，无法获得抽奖机会！')
      }
      ;``
      this.times++
      this.remainTimes--
      alert('恭喜您获得抽奖机会！')
    },
    // 抽奖
    draw() {
      // 因为有7个奖品，要满足a类是b类的3倍几率，所以只有做2次取值。
      let roll1_pool = [1, 2] // 奖池
      let roll1_probability = [0.75, 0.25] // 概率
      let pool_a = [1, 2, 3, 4, 5]
      let pool_b = [6, 7]
      let rolla = [0.2, 0.2, 0.2, 0.2, 0.2]
      let rollb = [0.5, 0.5]

      let res1 = randomProbability(roll1_pool, roll1_probability)
      if (res1 === 1) {
        this.prizeIndex = randomProbability(pool_a, rolla) - 1
      } else {
        this.prizeIndex = randomProbability(pool_b, rollb) - 1
      }
    },
    // 领奖
    handleGet: debounce(function() {
      this.prizeBtnActive = true
      setTimeout(() => {
        this.prizeBtnActive = false
        if ([2, 3, 4].includes(this.prizeIndex)) {
          alert('领取成功')
        }
        if ([6].includes(this.prizeIndex)) {
          alert('填写成功')
        }
        this.handleClose()
      }, 300)
    }, 300),
  },
}
</script>

<style lang="less">
@import '../styles/main.less';
body {
  width: 100vw;
}
.header {
  width: 750px;
  height: 1034px;
  position: relative;

  .record {
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 260px;
    left: 10px;
    width: 290px;
    overflow: hidden;
    height: 70px;
    padding-left: 10px;
    border-radius: 35px;
    padding-right: 10px;

    .lottery {
      display: flex;
      border-radius: 35px;
      position: absolute;
      align-items: center;
      height: 70px;
      width: 280px;
      font-weight: 500;
    }
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .word {
      flex: 1;
      color: #fff;
      text-align: left;
      font-size: 22px;
      line-height: 1.2;
    }
  }
}

.list-enter-to {
  transition: all 1s ease;
  transform: translateY(0);
}

.list-leave-active {
  transition: all 1s ease;
  transform: translateY(-100%);
}

.list-enter {
  transform: translateY(100%);
}

.list-leave {
  transform: translateY(0);
}

.mask {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .diglog {
    position: relative;
    width: 530px;
    .top {
      background: url(@b_egg_sprites) no-repeat;
      width: 530px;
      height: 367px;
      position: relative;
      top: 260px;
      background-size: 540px 3660px;
      z-index: 10;
      background-position: -4px -4px;
      animation: 1.5s mask-egg-up linear;
      animation-fill-mode: forwards;
    }
    .close {
      position: absolute;
      top: -80px;
      right: -15px;
      z-index: 12;
      background: url(@dialog) no-repeat;
      width: 67px;
      height: 67px;
      background-size: 560px 420px;
      background-position: -489px -4px;
    }
    .center {
      background: url(@b_egg_sprites) no-repeat;
      width: 532px;
      height: 172px;
      top: 85px;
      position: relative;
      background-size: 540px 3660px;
      background-position: -4px -778px;
      &.green {
        background-position: -4px -783px;
      }
      &.red {
        background-position: -4px -2430px;
      }
      &.yellow {
        background-position: -4px -2840px;
      }
      &.blue {
        background-position: -4px -1200px;
      }
    }
    .bottom {
      background: url(@b_egg_sprites) no-repeat;
      width: 532px;
      height: 332px;
      z-index: 12;
      position: relative;
      background-size: 540px 3660px;
      &.green {
        background-position: -4px -460px;
      }
      &.red {
        background-position: -4px -2107px;
      }
      &.yellow {
        background-position: -4px -3337px;
      }
      &.blue {
        background-position: -4px -1697px;
      }
    }
    .star {
      position: absolute;
      top: 220px;
      right: -80px;
      background: url(@dialog) no-repeat;
      width: 54px;
      height: 54px;
      z-index: 10;
      background-size: 560px 420px;
      background-position: -488px -138px;
      animation: 2s scale linear infinite normal;
    }
    .card {
      background: url(@dialog) no-repeat;
      width: 438px;
      height: 419px;
      z-index: 11;
      position: relative;
      background-size: 560px 420px;
      background-position: -25px -12px;
      position: absolute;
      bottom: 50px;
      left: 46px;
      animation: 3s mask-card-up linear;
      animation-fill-mode: forwards;
      animation-delay: 1.5s;
      opacity: 0;
      .prize {
        position: absolute;
        left: 50%;
        color: red;
        top: 120px;
        text-align: center;
        width: 380px;
        font-size: 32px;
        transform: translateX(-50%);
      }

      .tag {
        position: absolute;
        top: 282px;
        transform: translateX(-50%);
        width: 380px;
        color: rgba(0, 0, 0, 0.8);
        left: 50%;
        font-size: 32px;
        display: flex;
        line-height: 44px;
        .icon {
          line-height: 40px;
          position: relative;
          top: 8px;
          flex: 26px;
          background: url(@dialog) no-repeat;
          width: 26px;
          height: 26px;
          z-index: 10;
          background-size: 560px 420px;
          background-position: -490px -280px;
          display: inline-block;
          margin-right: 5px;
        }
      }
    }

    .btn {
      background: url(@toBtn) no-repeat;
      position: absolute;
      bottom: -200px;
      left: 50%;
      transform: translateX(-50%);
      background-size: 448px 1124px;
      &.q {
        height: 88px;
        background-position: -6px -848px;
        width: 360px;
      }
      &.q.active {
        height: 88px;
        background-position: -7px -944px;
        width: 360px;
      }
      &.pencil {
        height: 88px;
        background-position: -7px -566px;
        width: 360px;
      }
      &.pencil.active {
        height: 88px;
        background-position: -7px -662px;
        width: 360px;
      }
    }
  }
}

.gacha {
  background: url(@index_sprites) no-repeat;
  width: 750px;
  overflow: hidden;
  height: 1035px;
  position: relative;
  background-size: 1446px 1195px;
  background-position: -4px -4px;
  .btn {
    background: url(@btn_sprites) no-repeat;
    width: 179px;
    height: 180px;
    background-size: 531px 181px;
    position: absolute;
    top: 740px;
    left: 164px;
    background-position: -353px -1px;

    &.active {
      background-position: -176px -1px;
    }
    &.disabled {
      background-position: 1px -1px;
    }
  }
  .egg {
    background: url(@index_sprites) no-repeat;
    width: 132px;
    height: 146px;
    background-size: 1446px 1195px;
    position: absolute;
    top: 832px;
    right: 192px;
    animation: 2s egg linear forwards;
    &.blue {
      background-position: -4px -1044px;
    }
    &.green {
      background-position: -144px -1044px;
    }
    &.red {
      background-position: -284px -1044px;
    }
    &.yellow {
      background-position: -424px -1044px;
    }
  }
}
.main {
  background-color: #eddcc0;
  width: 750px;
  overflow: hidden;
  position: relative;
  .bell {
    width: 128px;
    height: 145px;
    background: url(@index_sprites) no-repeat;
    background-position: -1209px -656px;
    background-size: 1446px 1195px;
    position: absolute;
    right: 0;
    top: 300px;
    z-index: 2;
  }
  .remain {
    background: url(@index_sprites) no-repeat;
    width: 429px;
    margin: auto;
    height: 108px;
    margin-top: 32px;
    position: relative;
    background-size: 1446px 1195px;
    background-position: -763px -652px;
    .chance {
      background: url(@index_sprites) no-repeat;
      height: 58px;
      background-size: 1446px 1195px;
      position: absolute;
      top: 38px;
      right: 113px;
    }
    .chance0 {
      width: 50px;
      height: 58px;
      background-position: -1343px -507px;
    }
    .chance1 {
      width: 40px;
      background-position: -1362px -663px;
    }
    .chance2 {
      width: 42px;
      background-position: -776px -939px;
    }
    .chance3 {
      width: 40px;
      background-position: -855px -939px;
    }
    .chance4 {
      width: 48px;
      background-position: -929px -939px;
    }
    .chance5 {
      width: 40px;
      background-position: -1013px -939px;
    }
    .chance6 {
      width: 44px;
      background-position: -1088px -939px;
    }
  }

  .buy-class {
    margin: 35px auto 80px;
    display: flex;
    justify-content: center;
  }
  .buy {
    background: url(@index_sprites) no-repeat;
    height: 31px;
    width: 361px;
    background-position: -770px -786px;
    background-size: 1446px 1195px;
  }
  .icon {
    background: url(@index_sprites) no-repeat;
    height: 26px;
    width: 26px;
    background-position: -1410px -583px;
    margin-left: 10px;
    margin-top: 4px;
    background-size: 1446px 1195px;
  }

  .prize {
    position: relative;
    width: 680px;
    margin: 120px auto 0;
    .my {
      background: url(@index_sprites) no-repeat;
      height: 98px;
      width: 416px;
      background-position: -758px -827px;
      background-size: 1446px 1195px;
      position: absolute;
      z-index: 1;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
    }

    .top {
      background: url(@index_sprites) no-repeat;
      height: 152px;
      width: 680px;
      margin: 35px auto 0;
      background-position: -762px -180px;
      background-size: 1446px 1195px;
    }
    .center {
      background-color: #fff;
      width: 680px;
      margin: auto;
      min-height: 100px;
    }
    .bottom {
      background: url(@index_sprites) no-repeat;
      height: 152px;
      width: 680px;
      margin: auto;
      background-position: -762px -180px;
      background-size: 1446px 1195px;
      transform: rotate(180deg);
    }
  }
  .item {
    padding-left: 40px;
    display: flex;
    font-size: 26px;
    font-weight: 500;
    padding-bottom: 36px;
    .gongxi {
      margin-left: 40px;
      margin-right: 34px;
    }
  }
  .address {
    background: url(@toBtn) no-repeat;
    height: 88px;
    width: 442px;
    position: absolute;
    bottom: 60px;
    left: 50%;
    z-index: 1;
    transform: translateX(-50%);
    background-position: -4px -2px;
    background-size: 448px 1124px;
  }
  .rule {
    position: relative;
    width: 680px;
    margin: 120px auto 60px;
    .top {
      background: url(@index_sprites) no-repeat;
      height: 173px;
      width: 680px;
      margin: 35px auto 0;
      background-position: -762px 0px;
      background-size: 1446px 1195px;
    }
    .title {
      background: url(@index_sprites) no-repeat;
      height: 48px;
      width: 218px;
      position: absolute;
      left: 50%;
      z-index: 1;
      top: 72px;
      transform: translateX(-50%);
      background-position: -1189px -826px;
      background-size: 1446px 1195px;
    }
    .center {
      background-color: #f4ede1;
      width: 680px;
      margin: auto;
      min-height: 400px;
    }
    .bottom {
      background: url(@index_sprites) no-repeat;
      height: 151px;
      width: 680px;
      margin: auto;
      background-position: -762px -346px;
      background-size: 1446px 1195px;
    }
    .item {
      display: flex;
      padding: 32px;
      margin: 0 auto;
    }
    .no {
      background: url(@index_sprites) no-repeat;
      height: 42px;
      width: 42px;
      flex-basis: 42px;
      position: relative;
      top: 5px;
      margin-right: 16px;
      background-size: 1446px 1195px;
    }
    .no1 {
      background-position: -1187px -883px;
    }
    .no2 {
      background-position: -1237px -883px;
    }
    .no3 {
      background-position: -1287px -883px;
    }
    .no4 {
      background-position: -1337px -883px;
    }
    .word {
      width: 544px;
      font-size: 32px;
      line-height: 50px;
      padding-bottom: 32px;
      border-bottom: 4px dashed #eddcc0;
    }
  }
}

.happy {
  width: 564px;
  height: 400px;
  margin: auto;
  transform: scale(0.98);
  margin-top: 240px;
  background-color: transparent;
  background: url(@animation) no-repeat;
  background-size: 2256px 2000px;
  &.play {
    animation: play-png 2s steps(1) both;
  }
}
</style>
