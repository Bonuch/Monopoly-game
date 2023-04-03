<template>
    <div ref="shadowground" class="shadow-ground" :class="{ 'is-mobile': is_mobile }">
        <div :style="relationStyle" :class="{ animate: original_size }">
        </div>
    </div>
</template>
<script>
// Компонент создаёт плавно появляющийся, фиксированный фон,
// сохраняющий пропорции изображения независимо от размеров экрана

// Изображение загружается из хранилища Vuex: $store.state.background

export default {
    props: {
        is_mobile: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // Реальные размеры загружаемого изображения и соотношение сторон width / height
            original_size: null,
            // Путь к изображению
            url: ''
        }
    },
    methods: {
        // Определяем реальный размер изображения, предварительно незаметно его загружая
        calcRealImageSize () {
            if (!this.url) return
            var image = new Image();
            image.src = this.url
            image.style.opacity = 0
            this.$refs.shadowground.appendChild(image)

            if (image.complete) {
                this.setRelation(image.naturalWidth, image.naturalHeight)
                image.remove()
            }
            // Ожидаем загрузки изображения
            else {
                image.onload = (event) => {
                    event = event || window.event;
                    var el = event.target || event.srcElement;
                    this.setRelation(el.naturalWidth, el.naturalHeight)
                    el.remove()
                }
            }
        },
        setRelation (width, height) {
            this.original_size = {
                width: width,
                height: height,
                relation: width / height
            }
        },
    },
    computed: {
        relationStyle () {
            if (this.original_size) {
                return `width: calc((100vh - 68px) * ${this.original_size.relation});
                        background-image: url(${this.$store.state.background});`
            } else {
                return ''
            }
        },
    },
    watch: {
        '$store.state.background' (value) {
            this.original_size = null
            this.url = value
            this.calcRealImageSize()
        }
    },
    mounted () {
        this.url = this.$store.state.background
        this.calcRealImageSize()
    }
}
</script>

<style lang="scss">
    $header-height: 68px;
    $aside-width-small: 355px;
    $aside-width-big: 446px;
    
    .shadow-ground {
        top: $header-height;
        left: 0px;
        right: 0;
        bottom: 0px;
        z-index: 0;
        position: fixed;
        background: linear-gradient(0deg, #202124, #202124);
        /* for DEBUG background: #f009; */
        margin: 0 $aside-width-big;

        &.is-mobile {
            
            margin: 0 0 0 #{$aside-width-small};
            
            div {
                max-width: calc(100vw - #{$aside-width-small});
            }
        }

        div {
            max-width: calc(100vw - (#{$aside-width-big} * 2));
            position: relative;
            height: calc(100vh - #{$header-height});
            margin: auto;
            background-size: cover;
            /*background-size: contain; - лучше всё таки cover*/
            background-repeat: no-repeat;
            background-position-y: bottom;
            background-position-x: center;
            opacity: 0;
            transition: opacity 1s linear 0s;

            &.animate {
                opacity: 1;
            }
        }

        div::before, div::after {
            content: "";
            clear: both;
            height: 100%;
            position: absolute;
            top: 0;
            width: 20%;
        }
        div::before {
            left: 0px;
            background: linear-gradient(90deg, #202124, transparent);
        }
        div::after {
            right: 0px;
            background: linear-gradient(270deg, #202124, transparent);
        }
    }
    @media only screen and (max-width: 1720px) {
        .shadow-ground {
            
            margin: 0 #{$aside-width-small};
            
            div {
                max-width: calc(100vw - (#{$aside-width-small} * 2));
            }
        }
    }
</style>
