<template>
    <div class="banner-wrapper" :class="{mounted: mounted}">
        <swiper class="banner swiper-no-swiping" :options="swiperOption">
            <swiper-slide v-for="(slide, index) in sliders" :key="index">
                <router-link to="#" class="banner-item" :style="{backgroundImage: 'url(' + slide.image + ')'}">
                </router-link>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
    import 'swiper/dist/css/swiper.css'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'

    export default {
        name: "Banner",
        components: {
            swiper,
            swiperSlide
        },
        data() {
            return {
                totalSliders: 4,
                sliders: [
                    {
                        url: '!#',
                        image: '/images/banners/banner-1.jpg',
                    },
                    {
                        url: '!#',
                        image: '/images/banners/banner-2.jpg',
                    },
                    {
                        url: '!#',
                        image: '/images/banners/banner-3.jpg',
                    },
                    {
                        url: '!#',
                        image: '/images/banners/banner-4.jpg',
                    },
                ],
                mounted: false,
                swiperOption: {
                    loop: true,
                    slidesPerView: 3,
                    spaceBetween: 0,
                    slidesOffsetBefore: 15,
                    slidesOffsetAfter: 15,
                    autoplay: {
                        delay: 30000,
                        disableOnInteraction: false,
                    },
                    breakpoints: {
                            // when window width is >= 1024px
                        1024: {
                            slidesPerView: 2,
                        },
                    },
                    noSwiping: false
                }
            }
        },
        computed: {
          slidesPreviewCount() {
              if (window.innerWidth < 1024) {
                  return 2
              }
              return 3
            }
        },
        mounted() {
            setTimeout(() => {
                this.mounted = true
            }, 1000);
        }
    }
</script>

<style lang="scss" scoped>
    .banner-wrapper {
        position: relative;
        max-width: 684px;
        height: 150px;
        margin: 30px auto 15px;
        box-shadow: 0px 5.96885px 5.96885px rgba(0, 0, 0, 0.5);
        @media screen and (max-width: 1024px) {
            max-width: 510px;
        }
        &::after {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: calc(100% - 30px);
            bottom: 0;
            border-radius: 8px;
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
            background-color: transparent;
            pointer-events: none;
        }

        .banner {
            height: 150px;
            background-color: transparent;
            border-radius: 8px;
            .banner-item {
                display: block;
                position: relative;
                height: 150px;
                border-radius: 8px;
                background-color: transparent;
                background-size: cover;
                background-position: center;

                &--first {
                    background-image: url("/images/banners/banner-1.jpg");
                }

                &--second {
                    background-image: url("/images/banners/banner-2.jpg");
                }

                &--third {
                    background-image: url("/images/banners/banner-3.jpg");
                }

                &--fourth {
                    background-image: url("/images/banners/banner-4.jpg");
                }
            }
            .swiper-wrapper {
                .banner-item {
                    margin-left: -15px;
                    position: relative;
                    z-index: -1;
                }
            }
        }

        &.mounted {
            .banner {
                .banner-item {
                    transition: transform .3s;
                }
            }
        }
    }
</style>
