<template>
  <v-card>
    <v-card-text>
      <v-flex xs12>
        <v-container pa-0 ml-0>
          <v-flex xs12 sm12>
            <p class="text-align-l mt-0 mb-2 mr-0 ml-0 grey--text" v-text="$t('signing.sign_signature_style.text')" />
          </v-flex>
          <v-flex xs12
                  sm12
          >
            <div id="sign-style-options">
              <v-menu
                transition="slide-y-transition"
                bottom
              >
                <template v-slot:activator="{ on }">
                  <div class="b-input__control" v-on="on" @click="optionRendering()">
                    {{ selectedSig.title || $t('signing.select_signature_style.text') }}
                  </div>
                </template>
                <v-list>
                  <v-list-tile
                    v-for="(item, i) in items"
                    :key="i"
                    @click="selectSig(item,i)"
                  >
                    <canvas ref="mySigns"></canvas>
                  </v-list-tile>
                </v-list>
              </v-menu>

              <div class="b-select-icon v-input__append-inner"><div class="v-input__icon v-input__icon--append"><i aria-hidden="true" class="v-icon material-icons theme--light" style="">arrow_drop_down</i></div></div>

              <v-flex xs12 style="text-align:left"><canvas ref="demoSignature" ></canvas></v-flex>                       
          
            </div>
          </v-flex>
        </v-container>
      </v-flex>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import { getters, mutations } from '../store/type.js';
import { FONTS } from './../utils/constants';
export default {
  data: () => ({
    items: FONTS,
    selectedSig: {},
    unsubscribe: null,
    imageIndex: null,
    currentIndex: 0
  }),
  computed: {
    ...mapGetters({
      userData: getters.USER_DATA,
      SIGNATURE_STATUS: getters.SIGNATURE_STATUS
    }),
    ...mapState({
      companyStamp: state => state.companyStamp
    })
  },
  watch: {
    companyStamp: {
      handler() {
        console.log('watch : this.companyStamp');
        if (this.companyStamp && this.items.length === 3) {
          this.items.push({
            id: 4,
            title: '公司簽章'
          });
        }
        if (!this.companyStamp && this.items.length === 4) {
          this.items.pop();
        }
      }
    }
  },
  mounted() {
    this.optionRendering();
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === mutations.SET_SIGNATURE_STATUS) {
        if (this.imageIndex === this.currentIndex) {
          this.companyStamp && this.drawImageSign(this.$refs.demoSignature, 80);
        } else {
          this.renderDemoCanvas();
        }
      }
    });
    setTimeout(() => {
      this.selectSig(this.items[0], 0);
    }, 0);
  },
  destroyed() {
    this.unsubscribe();
  },
  methods: {
    ...mapMutations([mutations.SET_SIGNATURE_STATUS]),
    drawTextSign(name = '', size = 24, fontStyle = 'PingFang', canvasElement) {
      let calWidth = name.length * size + 20;

      canvasElement.width = calWidth;
      canvasElement.height = 40;

      var ctx = canvasElement.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.font = `${size}px ${fontStyle}`;
      ctx.fillText(name, 0, 30);
    },
    getDemoCanvasDataUrl() {
      return this.$refs.demoSignature.toDataURL();
    },
    renderDemoCanvas() {
      const ctx = this.$refs.demoSignature.getContext('2d');
      //clear first
      const linePadding = 4;
      this.$refs.demoSignature.height = 72;
      this.$refs.demoSignature.width = 250;
      const companyName = this.SIGNATURE_STATUS.companyName || '';
      const signingDate = this.SIGNATURE_STATUS.systemDate;
      const fontStyle = this.SIGNATURE_STATUS.fontStyleName;
      const size = 16;
      ctx.clearRect(0, 0, this.$refs.demoSignature.width, this.$refs.demoSignature.height);
      ctx.fillStyle = '#000';
      ctx.font = `${size}px ${fontStyle}`;
      let lineCount = 1;
      if (companyName.length !== 0) {
        ctx.fillText(companyName, 0, (size + linePadding) * lineCount);
        lineCount++;
      }
      ctx.fillText(this.userData.name, 0, (size + linePadding) * lineCount);
      lineCount++;
      ctx.fillText(signingDate, 0, (size + linePadding) * lineCount);
      lineCount++;
      // return this.canvasElement.toDataURL();
    },
    selectSig(val, index) {
      this.selectedSig = val;
      this.currentIndex = index;
      if (index !== this.imageIndex) {
        this.renderDemoCanvas();
      } else {
        this.companyStamp && this.drawImageSign(this.$refs.demoSignature, 80);
      }
      this[mutations.SET_SIGNATURE_STATUS](val);
    },
    drawImageSign(canvasElement, height) {
      const img = new Image();
      img.src = this.companyStamp;
      const ctx = canvasElement.getContext('2d');
      canvasElement.height = height;
      img.onload = () => {
        canvasElement.width = (img.width * height) / img.height;
        ctx.drawImage(img, 0, 0, (img.width * height) / img.height, height);
      };
    },
    optionRendering() {
      for (let i = 0, l = this.items.length; i < l; i++) {
        let option = this.items[i];
        setTimeout(() => {
          if (option.title !== '公司簽章') {
            this.drawTextSign(this.userData.name, 24, option.fontStyleName, this.$refs.mySigns[i]);
          } else {
            this.imageIndex = i;
            this.drawImageSign(this.$refs.mySigns[i], 40);
          }
        }, 0);
      }
    }
  }
};
</script>
 
<style lang="scss">
#sign-style-options {
  position: relative;

  .b-icon {
    text-align: right;
  }
  .b-input__control {
    display: flex;
    flex-direction: column;
    height: auto;
    flex-grow: 1;
    flex-wrap: wrap;
    width: 100%;
    font-size: 16px;
    text-align: left;
  }
  .b-select-icon {
    width: 24px;
    height: 24px;
    position: absolute;
    top: 0;
    right: 0;
  }
  .sig-style {
    padding-top: 8px;
    width: 100%;
  }
}
</style>
