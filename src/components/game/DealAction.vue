<template>
  <b-button class="half-tile-button" v-bind:style="dealUserButtonStyle()" v-show="isDealButtonAvailable()" @click="makeOffer()" :disabled="!proposeButtonEnabled()" variant="success"><i class="fas fa-handshake"></i>&nbsp;<span v-html="$parent.userTitle(userId)"></span></b-button>
  <!--<span v-sho	w="isWaitingForResult">ждем результата сделки ...</span>-->
</template>

<script>
import { mapGetters } from "vuex";
import axios from '@/helpers/axios-instance';

export default {
  data() {
    return {
      give: {
        sum: 0,
        fields: []
      },
      get: {
        sum: 0,
        fields: []
      },
      isMakingDeal: false,
      isWaitingForResult: false
    }
  },
  props: {
    userId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
  name: 'DealAction',
  created() {
    this.isWaitingForResult = this.$parent.state.deal && Object.keys(this.$parent.state.deal).length > 0;

    if (this.$parent.state.deal && Object.keys(this.$parent.state.deal).length == 0) {
      this.makeOffer();
    }
  },
  methods: {
    makeOffer() {
      if (!this.$parent.state.deals_enabled) {
        if (this.$parent.state.options.fairtrades) {
          alert('Обмены станут доступны как только все поля будут раскуплены');
        } else {
          alert('Обмены недоступны сейчас');
        }

        return;
      }

      let finishFunc = () => {
        this.give.sum = 0;
        this.give.fields = [];
        this.get.sum = 0;
        this.get.fields = [];
        this.$parent.isSelectable = true;
        this.isMakingDeal = true;

        let selectableCellsIds = [];
        this.$parent.state.cells.forEach((cell, index) => {
          if (cell.type == 'active' 
            && (cell.owner_id == this.currentUser.user_id || cell.owner_id == this.userId)
            && cell.stars_count == 0 && this.$parent.monopolyMaxStars(index) == 0 && !cell.is_bailed) {
            selectableCellsIds.push(index);
          }
        });

        let cells = this.$parent.$children.filter(child => child.$options.name == 'Gamecell' && selectableCellsIds.indexOf(parseInt(child.id)) != -1);
        cells.forEach(this.setCellSelectable);
        this.$parent.$refs.dealmodal.action_ref = this;
        this.$parent.$refs.dealmodal.$forceUpdate();
        this.$parent.$refs.dealmodal.onShow();
      }
      let errorAction = () => {
        window.alert(
          'Случилась ошибка во время создания сделки, пожалуйста повторите попытку, возможно с другими условиями сделки. Будет отлично если сообщите об этой ошибке в поддержку'
        );
        this.cancelAction();
      };

      if (this.$parent.state.options.fastgame) {
        axios.get('/start-deal').then(() => {
          finishFunc();
        }).catch(() => {
          errorAction();
        });
      } else {
        finishFunc();
      }
    },
    setCellSelectable(cell) {
      cell.isSelectable = true;
      cell.isSelected = false;

      cell.cellAction = () => {
        cell.isSelectable = false;

        if (cell.owner_id == this.currentUser.user_id) {
          this.give.fields.push(cell.id);
        } else {
          this.get.fields.push(cell.id);
        }

        this.$parent.$refs.dealmodal.submitDisabled = this.submitDisabled();
      };
    },
    removeCellFromList(id) {
      let cell = this.$parent.$children.filter((child) => child.$options.name == 'Gamecell' && child.id == id)[0];

      if (cell.owner_id == this.currentUser.user_id) {
        this.give.fields.splice(this.give.fields.indexOf(id), 1);
      } else {
        this.get.fields.splice(this.get.fields.indexOf(id), 1);
      }

      this.setCellSelectable(cell);
      this.$parent.$refs.dealmodal.submitDisabled = this.submitDisabled();
    },
    cancelAction() {
      let finishFunc = () => {
        this.isMakingDeal = false;
        this.isWaitingForResult = false;
        this.$parent.cancelSelect();
      };

      if (this.$parent.state.options.fastgame) {
        axios.get('/cancel-deal' ).then(() => {
          finishFunc();
        }).catch(() => {
        });
      } else {
        finishFunc();
      }

      this.$parent.dealButtonsVisible = false;
      this.$parent.blurredGamelogAreaHeight = 0;
    },
    submitAction() {
      this.$parent.cancelChildrenSelect();
      this.isWaitingForResult = true;
      this.isMakingDeal = false;

      let errorAction = () => {
        window.alert(
          'Случилась ошибка во время создания сделки, пожалуйста повторите попытку, возможно с другими условиями сделки. Будет отлично если сообщите об этой ошибке в поддержку'
        );
        this.cancelAction();
      };

      axios.get('/propose-deal', { params: { give: this.give, get: this.get, user_id: this.userId } } ).then(response => {
        if (response.data.message) {
          window.alert(response.data.message);
        } else {
          errorAction();
        }

        this.$parent.dealButtonsVisible = false;
        this.$parent.isSelectable = false;
        this.$parent.blurredGamelogAreaHeight = 0;
      }).catch(() => {
        this.$parent.dealButtonsVisible = false;
        errorAction();
      });
    },
    giveEquivalent(sum = null) {
      if (!sum) {
        sum = this.give.sum;
      }

      return (+sum || 0) + this.give.fields.reduce((value, fieldId) => {
        return value + parseInt(this.$parent.state.cells[fieldId].price);
      }, 0);
    },
    receiveEquivalent(sum = null) {
      if (!sum) {
        sum = this.get.sum;
      }

      return (+sum || 0) + this.get.fields.reduce((value, fieldId) => {
        return value + parseInt(this.$parent.state.cells[fieldId].price);
      }, 0);
    },
    fieldTitle(id) {
      return this.$parent.state.cells[id].title + '&nbsp;(' + this.$parent.state.cells[id].price + '&nbsp;<span style="font-family:BTC">BTC</span>)';
    },
    submitDisabled(sum1 = null, sum2 = null) {
      if (this.give.fields.length == 0 && this.get.fields.length == 0) {
        this.$parent.$refs.dealmodal.distinction.visible = false;
        return true;
      }

      this.$parent.$refs.dealmodal.distinction.visible = true;

      let num1 = this.giveEquivalent(sum1);
      let num2 = this.receiveEquivalent(sum2);

      this.$parent.$refs.dealmodal.distinction.leftBigger = num1 > num2;

      if (num1 > num2) {
        this.$parent.$refs.dealmodal.distinction.leftOptimal = Math.floor(num2 * 1.5);
        this.$parent.$refs.dealmodal.distinction.rightOptimal = Math.ceil(num1 / 1.5);
      } else {
        this.$parent.$refs.dealmodal.distinction.leftOptimal = Math.ceil(num2 / 1.5);
        this.$parent.$refs.dealmodal.distinction.rightOptimal = Math.floor(num1 * 1.5);
      }

      if ((Math.max(num1, num2) / Math.min(num1, num2)) > 1.5) {
        return true;
      }

      this.$parent.$refs.dealmodal.distinction.visible = false;
    },
    updateVarsFromState() {
      this.isWaitingForResult = this.$parent.state.deal && Object.keys(this.$parent.state.deal).length > 0;

      if (this.isWaitingForResult) {
        this.isMakingDeal = false;
      }

      // Убрал чтобы залог/выкуп полей работал, возможно нужно включить ситуативно
      //this.$parent.cancelSelect();
    },
    isDealButtonAvailable() {
      try {
        let ableToBuyOrSellFields = this.$parent.state.actives[this.currentUser.user_id].length > 0 || this.$parent.state.actives[this.userId].length > 0;
        return ableToBuyOrSellFields;
        //return !this.isWaitingForResult && ableToBuyOrSellFields;
      } catch(e) {
        return false;
      }
    },
    proposeButtonEnabled() {
      if (this.$parent.isSelectable) {
        return false;
      }

      return this.$parent.isUserTurn();
    },
    dealUserButtonStyle() {
      let heights = {
        4: '27px',
        3: '36px',
        2: '55px',
        1: '110px'
      };

      return {
        height: heights[this.$parent.state.active_user_ids.length - 1] + ' !important',
        fontSize: '13px',
        padding: 0
      };
    }
  }
}
</script>

