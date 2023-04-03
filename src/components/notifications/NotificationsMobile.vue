<template>
    <div class="site-notifications" v-click-outside="onClickOutside">
        <a v-if="allNotifications.length > 0"
           class="site-notifications__icon trash"
           :title="$t('NOTIFY.Удалить уведомления')"
           :class="{visible: this.hiddenOpened}"
           href="#"
           @click.prevent="clearList">
            <svg width="9" height="11" viewBox="0 0 9 11" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0.642857 9.77778C0.642857 10.4531 1.21821 11 1.92857 11H7.07143C7.78179 11 8.35714 10.4531 8.35714 9.77778V2.44444H0.642857V9.77778ZM9 0.611111H6.75L6.10714 0H2.89286L2.25 0.611111H0V1.83333H9V0.611111Z"
                />
            </svg>
        </a>

        <a
            href="#"
            class="site-notifications__icon calendar"
        >
            <svg width="20" height="19" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M15.5556 8.18182H4.44444V10H15.5556V8.18182ZM17.7778 1.81818H16.6667V0H14.4444V1.81818H5.55556V0H3.33333V1.81818H2.22222C0.994444 1.81818 0.0111111 2.63182 0.0111111 3.63636L0 16.3636C0 17.3682 0.994444 18.1818 2.22222 18.1818H17.7778C19.0056 18.1818 20 17.3682 20 16.3636V3.63636C20 2.63182 19.0056 1.81818 17.7778 1.81818ZM17.7778 16.3636H2.22222V6.36364H17.7778V16.3636ZM12.2222 11.8182H4.44444V13.6364H12.2222V11.8182Z"
                />
            </svg>
        </a>

        <a v-if="allNotifications.length > 0"
           class="site-notifications__icon bell"
           :title="hiddenOpened ? $t('NOTIFY.Скрыть уведомления') : $t('NOTIFY.Показать уведомления')"
           :class="{opened: this.hiddenOpened, active: (!this.hiddenOpened && this.hasOutdated)}"
           href="#"
           @click.prevent="toggleList">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <path
                    d="M5.56892 1.62051L4.13534 0.153846C1.73434 2.02564 0.150376 4.91795 0 8.20513H2.00501C2.1604 5.48718 3.52882 3.10769 5.56892 1.62051ZM17.995 8.20513H20C19.8496 4.91795 18.2657 2.02564 15.8647 0.153846L14.4361 1.61538C16.4712 3.10769 17.8396 5.48718 17.995 8.20513ZM16.015 8.71795C16.015 5.5641 14.3759 2.93333 11.5038 2.2359V1.53846C11.5038 0.68718 10.8321 0 10 0C9.16792 0 8.49624 0.68718 8.49624 1.53846V2.2359C5.62406 2.93333 3.98496 5.5641 3.98496 8.71795V13.8462L1.97995 15.8974V16.9231H18.0201V15.8974L16.015 13.8462V8.71795ZM10 20C10.1404 20 10.2757 19.9846 10.406 19.959C11.0576 19.8205 11.594 19.359 11.8496 18.7487C11.9499 18.5026 12.005 18.2359 12.005 17.9487H7.99499C7.99499 19.0821 8.89223 20 10 20Z"/>
            </svg>
        </a>

        <NotificationList v-if="!hiddenOpened" position="top" :notifications="visibleNotifications" /><!-- positioned absolute -->
        <div v-if="hiddenOpened" class="hiddenList">
            <perfect-scrollbar ref="ps">
                <NotificationList position="list" :flex-height="true" :notifications="allNotifications" /><!-- positioned inline -->
            </perfect-scrollbar>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import NotificationList from './NotificationList';

    export default {
        name: 'NotificationsMobile',
        components: {
            NotificationList
        },
        props: {
            popupNumber: {
                type: Number,
                required: false,
                default: 5
            },
            listNumber: {
                type: Number,
                required: false,
                default: 20
            },
            messageHeight: {
                type: Number,
                required: false,
                default: 78
            },
            errorHeight: {
                type: Number,
                required: false,
                default: 78
            },
            gameInviteHeight: {
                type: Number,
                required: false,
                default: 150
            },
            contactInviteHeight: {
                type: Number,
                required: false,
                default: 78
            }
        },
        data() {
            return {
                hiddenOpened: false,
            };
        },
        mounted() {
            setInterval(this.hideNotifications, 1000);
        },
        computed: {
            ...mapGetters([
                'notifications',
            ]),
            hasOutdated() {
                let number = 0;
                for (const n of this.notifications) {
                    if (n.status > 0 && n.status < 10) number++;
                }
                return number;
            },
            visibleNotifications() {
                let position = 32;
                let limit = this.popupNumber;
                const visible = [];
                for (const n of this.notifications) {
                    if (n.status === 0) {
                        n.position = `${position}px`;
                        // подсчитываем позицию следующего уведомления в зависимости от типа
                        switch (n.type) {
                            case 'message': position += this.messageHeight; break;
                            case 'error': position += this.errorHeight; break;
                            case 'friend-invitation': position += this.contactInviteHeight; break;
                            case 'game-invitation': position += this.gameInviteHeight; break;
                            default: position += 30;
                        }
                        visible.push(n);
                        if ((limit--) < 0) break;
                    }
                }
                return visible;
            },
            allNotifications() {
                let limit = this.listNumber;
                const items = [];
                for (const n of this.notifications) {
                    if (n.status < 10) {
                        n.position = 'auto';
                        items.push(n);
                        if ((limit--) < 0) break;
                    }
                }
                return items;
            }
        },
        methods: {
            ...mapActions([
                'hideNotification',
                'hideNotifications',
                'removeAllNotifications',
            ]),
            toggleList() {
                this.hiddenOpened = !this.hiddenOpened;
            },
            clearList() {
                this.removeAllNotifications();
                this.hiddenOpened = false;
            },
            onClickOutside() {
                if (this.hiddenOpened) {
                    this.hiddenOpened = false;
                }
            },
        }
    };
</script>

<style scoped lang="scss">
    .site-notifications {
        box-sizing: border-box;
        position: relative;
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 18px 13px 18px 15px;

        &__icon {
            position: relative;
            width: 20px;
            height: 20px;
            margin: 0 8px;

            &:hover,
            &:active,
            &:focus, {
                svg {
                    fill: #fff;
                }
            }

            svg {
                width: 100%;
                height: 100%;
                fill: #B0B0B0;
                transition: all 0.3s ease;
            }

            &:first-of-type {
                margin-left: auto;
            }

            &:last-of-type {
                margin-right: 0;
            }
        }

        .trash {
            display: none;

            &.visible {
                display: block;
            }
        }

        .calendar {
            display: none;
        }

        .bell {
            &.active {
                &:after {
                    content: '';
                    position: absolute;
                    right: -5px;
                    top: -5px;
                    width: 5px;
                    height: 5px;
                    background-color: #EA00FE;
                    border-radius: 50%;
                }
            }
        }

        .hiddenList {
            position: absolute;
            top: 31px;
            right: 6px;
            width: 280px;
            height: auto;
            min-height: 300px;
            border-radius: 4px;
            z-index: 100;
            text-align: left;
        }
        .ps {
            height: 300px;
            padding: 1px;
        }
    }

    @media all and (max-width: 1440px) {
        .site-notifications {
            .hiddenList {
                top: 54px;
            }
        }
    }
</style>
