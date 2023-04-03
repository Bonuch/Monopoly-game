<template>
  <b-col>
    <b-button v-show="!cancelButtonVisible()" :class="buttonClassImproved(1)" :disabled="$parent.isAnimatingDices || $parent.isSelectable || !$parent.isUserTurn() || $parent.state.confirmation || $parent.state.trade_request" v-if="fieldsToBailExist() || bailedFieldsExist() || isRailwayOwner()" @click="bailInOutField()"><div style="height:102px"><img height="45" src="/icons/board/bid_0004_recycling.png"/><br/>
      <div v-if="!isRailwayOwner() && !isMunicipalityOwner()" style="height:50px;padding-top:10px;">Заложить или выкупить поле</div>
      <div v-if="isRailwayOwner() || isMunicipalityOwner()" style="height:55px;">Заложить, выкупить или продать поле</div></div></b-button>
    <b-button v-show="!cancelButtonVisible()" v-bind:class="buttonClassImproved(2)" :disabled="$parent.isAnimatingDices || $parent.isSelectable || !$parent.isUserTurn() || $parent.state.confirmation" v-if="fieldsToSellExist()" @click="sellField()"><img height="45" src="/icons/board/bid_0004_recycling.png"/><div style="height:45px;padding-top:15px;">Продать поле</div></b-button>
  </b-col>
</template>

<script>
import { mapGetters } from "vuex";
import axios from '@/helpers/axios-instance';

  let actionsCounter = 0;

export default {
  data() {
    return {
      isSelectable: false,
    }
  },
  props: {
    id: {
      type: String,
      default: null
    },
  },
  name: 'UserActivesActions',
  computed: {
    ...mapGetters(["currentUser"]),
    buttonClassIndex() {
      let cnt = 0;

      if (this.fieldsToBailExist() || this.bailedFieldsExist()) {
        cnt += 1;
      }

      if (this.fieldsToSellExist()) {
        cnt += 1;
      }

      if (this.isRailwayOwner()) {
        cnt += 1;
      }

      return cnt;
    },
    buttonClass: function() {

      let classes = {
        1: 'tile-button white-space-normal',
        2: 'tile-button white-space-normal',
        3: 'tile-button white-space-normal',
        4: 'tile-button white-space-normal'
      };

      return classes[this.buttonClassIndex];
    },
  },
  beforeUpdate() {
    actionsCounter = 0;
  },
  // Без этого баг появляется
  mounted() {
    actionsCounter = 0;
  },
  methods: {
    buttonClassImproved() {
      actionsCounter += 1;

      return actionsCounter == this.buttonClassIndex ? this.buttonClass : this.buttonClass + ' white-bottom-border';
    },

    // Any code
    getMonopoliesMaxStars() {
      try {
        let monopoliesStars = {};

        this.$parent.state.actives[this.id].forEach(id => {
          let monopolyId = this.$parent.state.cells[id].monopoly_id;

          if (typeof(monopoliesStars[monopolyId]) == 'undefined') {
            monopoliesStars[monopolyId] = this.$parent.state.cells[id].stars_count;
          } else if(this.$parent.state.cells[id].stars_count > monopoliesStars[monopolyId] && this.$parent.state.cells[id].owner_id == this.currentUser.user_id) {
            monopoliesStars[monopolyId] = this.$parent.state.cells[id].stars_count;
          }
        });

        return monopoliesStars;
      } catch(e) {
        return false;
      }
    },

    cancelAction() {
      this.isSelectable = false;
      this.$parent.cancelSelect();
    },

    // Fields code
    fieldsToBailExist() {
      try {
        if (this.$parent.state.options.nobails) {
          return false;
        }

        if (this.$parent.state.options.myrules) {
          return this.$parent.state.actives[this.id].some(activeId => {
            return this.$parent.state.cells[activeId].stars_count == 0;
          });
        }

        let monopoliesStars = this.getMonopoliesMaxStars();

        return this.$parent.state.actives[this.id].some(activeId => {
          return monopoliesStars[this.$parent.state.cells[activeId].monopoly_id] == 0 && !this.$parent.state.cells[activeId].is_bailed;
        });
      } catch(e) {
        return false;
      }
    },
    fieldsToSellExist() {
      if (!this.$parent.state.options.nobails) {
        return false;
      }

      let monopoliesStars = this.getMonopoliesMaxStars();

      return this.$parent.state.actives[this.id].some(activeId => {
        return monopoliesStars[this.$parent.state.cells[activeId].monopoly_id] == 0;
      });
    },
    sellField() {
      this.isSelectable = true;
      this.$parent.isSelectable = true;
      let monopoliesStars = this.getMonopoliesMaxStars();

      let selectableCellsIds = this.$parent.state.actives[this.id].filter(activeId => {
        return monopoliesStars[this.$parent.state.cells[activeId].monopoly_id] == 0;
      });

      let cells = this.$parent.$children.filter((child) => child.$options.name == 'Gamecell' && selectableCellsIds.indexOf(parseInt(child.id)) != -1);
      cells.forEach(cell => {
        cell.isSelectable = true;
        cell.cellAction = () => {
          axios.get('/sell-active', { params: { id: cell.id } }).then(response => {
            if (response.data.message) {
              window.alert(response.data.message);
            }

            cell.resetBgColor();
            cell.$forceUpdate();
            this.cancelAction();
          }).catch(() => {});
        };
      });
    },
    // Unbail code
    // also has copy in BailModal
    bailedFieldsExist() {
      try {
        if (this.$parent.state.options.nobails) {
          return false;
        }

        return this.$parent.state.actives[this.id].some(activeId => {
          return this.$parent.state.cells[activeId].is_bailed;
        });
      } catch(e) {
        return false;
      }
    },

    isRailwayOwner() {
      return this.$parent.state.railway_owner && this.$parent.state.railway_owner == this.currentUser.user_id;
    },

    isMunicipalityOwner() {
      return this.$parent.state.municipality_owner && this.$parent.state.municipality_owner == this.currentUser.user_id;
    },

    cancelButtonVisible() {
      return this.$parent.isSelectable && this.isSelectable;
    },

    bailInOutField() {
      this.isSelectable = true;
      this.$parent.isSelectable = true;
      let monopoliesStars = this.getMonopoliesMaxStars();
      this.$parent.isBailModalVisible = true;
      this.$parent.$refs.bailModal.$forceUpdate();
      this.$parent.$refs.bailModal.onShow();
    },
  }
}
</script>

