<template>
  <div class="back" @click="userPicBackClick($event)">
    <div>
      <div v-show="screenIndex == 'main'" v-bind:class="'user-block-inner profile-user-' + (pos + 1)"> 
        <b-container fluid style="padding:0 2px;">
          <b-row no-gutters style="font-size:10px;text-align:center;font-weight:bold;">
            <b-col style="height:55px">
              <div style="text-align:center;position:absolute;bottom:0;left:0;right:0;">
                <a style="color:white" href="javascript:;" @click="openMessagesTab(id)">
                  <img width="32" src="/icons/board/pm.png"/>
                  <br/>
                  В&nbsp;личку
                </a>
              </div>
            </b-col>
            <b-col style="height:55px">
              <div style="text-align:center;position:absolute;bottom:0;left:0;right:0;">
                <a v-if="isAbleToAddFriend" style="color:white" href="javascript:;" @click="addFriend(id)">
                  <img style="margin-left:6px" width="38" src="/icons/board/add_2_friend.png"/>
                  <br/>
                  <div style="margin-top:-4px">
                    В&nbsp;друзья
                  </div>
                </a>
                <span class="disabled-elem" v-if="!isAbleToAddFriend" style="color:grey;opacity:0.5">
                  <img style="margin-left:6px" width="38" src="/icons/board/add_2_friend.png"/>
                  <br/>
                  <div style="margin-top:-4px">
                    В&nbsp;друзья
                  </div>
                </span>
              </div>
            </b-col>
            <b-col style="height:55px">
              <div style="text-align:center;position:absolute;bottom:0;left:0;right:0;">
                <a style="color:white" href="javascript:;" @click="$parent.userGiftClick(id)">
                  <img width="26" src="/icons/board/gift.png"/>
                  <br/>
                  Подарок
                </a>
              </div>
            </b-col>
          </b-row>
          <b-row no-gutters style="font-size:10px;text-align:center;font-weight:bold;">
            <b-col style="height:60px">
              <div style="text-align:center;position:absolute;bottom:0;left:0;right:0;">
                <a style="color:white" href="javascript:;" @click="$parent.userProfileClick(id)">
                  <img width="35" src="/icons/board/profile.png"/>
                  <br/>
                  Профиль
                </a>
              </div>
            </b-col>
            <b-col style="height:60px">
              <div style="text-align:center;position:absolute;bottom:0;left:0;right:0;">
                <a v-if="isAbleToIgnoreUser" style="color:white" href="javascript:;" @click="ignoreUser(id)">
                  <img width="35" src="/icons/board/mute.png"/>
                  <br/>
                  В&nbsp;игнор
                </a>
                <span class="disabled-elem" v-if="!isAbleToIgnoreUser" style="color:grey;opacity:0.5">
                  <img width="35" src="/icons/board/mute.png"/>
                  <br/>
                  В&nbsp;игнор
                </span>
              </div>
            </b-col>
            <b-col style="height:60px">
              <div v-if="visitorAbleToAppeal()" style="text-align:center;position:absolute;bottom:0;left:0;right:0;">
                <a style="color:white" href="javascript:;" @click="screenIndex = 'appeal-1'">
                  <img width="26" src="/icons/board/report.png"/>
                  <br/>
                  Жалоба
                </a>
              </div>
            </b-col>
          </b-row>
        </b-container>
        <div class="clearfix"></div>
      </div>

      <div v-show="screenIndex == 'appeal-1'" v-bind:class="'user-block-inner profile-user-' + (pos + 1)">
        <div style="padding:6px 0;font-size:16px;">{{$parent.userTitle(id)}}</div>
        <b-button-group vertical size="sm" style="position:absolute;bottom:10px;left:15px;right:15px;">
          <b-button @click="appealType = 1;screenIndex = 'appeal-2'" size="sm">Сговор</b-button>
          <b-button @click="appealType = 2;screenIndex = 'appeal-2'" size="sm">Оскорбления</b-button>
          <b-button @click="appealType = 3;screenIndex = 'appeal-2'" size="sm">Затягивание игры</b-button>
        </b-button-group>
      </div>

      <div v-show="screenIndex == 'appeal-2'" v-bind:class="'user-block-inner profile-user-' + (pos + 1)">
        <div style="padding:6px 0;font-size:16px;">{{$parent.userTitle(id)}}</div>
        <b-form-textarea no-resize size="sm" v-model="appealComment" placeholder="Комментарий, можно оставить пустым" style="position:absolute;left:15px;right:15px;bottom:40px;top:30px;width:140px;font-size:12px;"></b-form-textarea>
        <b-button-group vertical size="sm" style="position:absolute;bottom:10px;left:15px;right:15px;">
          <b-button @click="makeAppeal()" size="sm">Отправить !</b-button>
        </b-button-group>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from '@/helpers/axios-instance';
import { mapGetters } from "vuex";
import MainMixin from '@/mixins/main-mixin';
import EventBus from '@/helpers/global-event-bus';
import { addFriendRequest } from "@/helpers/add-friend-request";


export default {
  name: 'UserMenuWidget',
  mixins: [MainMixin],
  data() {
    return {
      screenIndex: 'main',
      appealComment: '',
      appealType: null,
      isAbleToAddFriend: true,
      isAbleToIgnoreUser: true,
      returnBackCallback: null
    }
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  props: {
    pos: {
      type: Number,
      default: null,
    },
    id: {
      type: Number,
      default: null
    }
  },
  methods: {
    makeAppeal() {
      axios.get('/make-appeal', { params: { user_id: this.id, type: this.appealType, comment: this.appealComment } }).then(response => {
        if (response.data.message) {
          window.alert(response.data.message);
        }

        if (this.returnBackCallback) {
          this.returnBackCallback();
        }
      }).catch(() => {});
    },
    visitorAbleToAppeal() {
      return this.currentUser && this.$parent.state.user_ids.indexOf(this.currentUser.user_id) != -1;
    },
    flipContainerFromPath(path) {
      for (let i=0;i < path.length;i++) {
        if (path[i].className.match(/flip-container/)) {
          return path[i];
        }
      }
    },
    userPicBackClick(event) {
      let parentIsLink = $(event.target).parents('a').length > 0;

      if (parentIsLink || event.target.tagName.toLowerCase() == 'button' || event.target.tagName.toLowerCase() == 'textarea') {
        return;
      }

      let parentIsDisabledElem = $(event.target).parents('.disabled-elem').length > 0;

      if (parentIsDisabledElem) {
        return;
      }

      let $el = $(this.flipContainerFromPath(event.path));

      if ($el.data('flip-back-timeout')) {
        clearTimeout($el.data('flip-back-timeout'));
        $el.data('flip-back-timeout', null);
      }

      this.userPicMouseOut($el);
    },
    userPicClick(event) {
      let $el = $(this.flipContainerFromPath(event.path));

      this.returnBackCallback = () => {
        this.userPicMouseOut($el);
      };

      $el.addClass('hover');

      $el.bind('mouseout', (evt) => {
        if (!$(evt.relatedTarget).parents('.flip-container').length) {
          $el.data('flip-back-timeout', setTimeout(() => {
            this.userPicMouseOut($el);
          }, 4000));
        }
      });

      $el.bind('mouseover', () => {
        if ($el.data('flip-back-timeout')) {
          clearTimeout($el.data('flip-back-timeout'));
          $el.data('flip-back-timeout', null)
        }
      });

      setTimeout(() => {
        $el.find('.front').css('display', 'none');
      }, 600);
    },
    userPicMouseOut($el) {
      $el.find('.front').css('display', 'block');
      $el.addClass('hovering-out').removeClass('hover');

      setTimeout(() => {
        $el.removeClass('hovering-out');
        $el.unbind('mouseout');

        // Возвращем в меню выбор к начальному меню
        this.$parent.$refs.usermenu.forEach(widget => {
          widget.screenIndex = 'main';
        });
      }, 600);
    },
    addFriend(userId) {
      addFriendRequest(userId, () => {
        if (this.returnBackCallback) {
          this.returnBackCallback();
        }

        this.$parent.refresh();
      });
    },
    setFriendAddVar(matrix) {
      this.isAbleToAddFriend = this.currentUser && !matrix[this.currentUser.user_id][this.id];
    },
    setIgnoreUserVar(matrix) {
      this.isAbleToIgnoreUser = this.currentUser && !matrix[this.currentUser.user_id][this.id];
    },
    openMessagesTab(id) {
      EventBus.$emit('messages-widget-focus-chat-window', id);
      EventBus.$emit('draggable-friends-widget-show-friends-and-messages');
    },
    ignoreUser(id) {
      axios.get('/ban-user', { params: { id: id } }).then(response => {
        if (response.data.message) {
          window.alert(response.data.message);
        }

        this.$parent.refresh();
      });
    }
  }
}
</script>



