<template>
    <div class="base-loader">
        <svg id="base-loader-loading" viewbox="0 0 100 80">
            <defs>
                <linearGradient id="gradient" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#4383b8"/>
                    <stop offset="100%" stop-color="#4aa06c"/>
                </linearGradient>

                <clipPath id="rects">
                    <rect class="rect" id="rect1" x="0" y="0" width="30" height="30" rx="2" ry="2"/>
                    <rect class="rect" id="rect2" x="0" y="0" width="30" height="30" rx="2" ry="2"/>
                    <rect class="rect" id="rect3" x="0" y="0" width="30" height="30" rx="2" ry="2"/>
                    <rect class="rect" id="rect4" x="0" y="0" width="30" height="30" rx="2" ry="2"/>
                    <rect class="rect" id="rect5" x="0" y="0" width="30" height="30" rx="2" ry="2"/>
                    <rect class="rect" id="rect6" x="0" y="0" width="30" height="30" rx="2" ry="2"/>
                    <rect class="rect" id="rect7" x="0" y="0" width="30" height="30" rx="2" ry="2"/>
                </clipPath>
            </defs>
            <!--
              (100 / sqrt(2 * 30^2)) == 0.707.
              Used pythagorean principle to scale the rectangles to fit within a 100x100 viewport
            -->
            <rect transform="translate(50) scale(0.707, 0.707) rotate(45)" x="0" y="0"
                  width="100" height="100" fill="url(#gradient)" clip-path="url(#rects)">
            </rect>
        </svg>
    </div>
</template>

<script>
    export default {
        name: "BaseLoader"
    }
</script>

<style lang="scss" scoped>
    $boxWidth : 33px;
    $animationDuration : 15s;
    $animationStepDuration : $animationDuration / 7;

    @keyframes slide {
        0% {
            transform: translate(0, 0);
        }
        2% {
            transform: translate($boxWidth, 0);
        }

        12.5% {
            transform: translate($boxWidth, 0);
        }
        15.5% {
            transform: translate(2 *$boxWidth, 0);
        }

        25% {
            transform: translate(2 *$boxWidth, 0);
        }
        27% {
            transform: translate(2 *$boxWidth, $boxWidth);
        }

        37.5% {
            transform: translate(2 *$boxWidth, $boxWidth);
        }
        39.5% {
            transform: translate($boxWidth, $boxWidth);
        }

        50% {
            transform: translate($boxWidth, $boxWidth);
        }
        52% {
            transform: translate($boxWidth, 2 *$boxWidth);
        }

        62.5% {
            transform: translate($boxWidth, 2 *$boxWidth);
        }
        64.5% {
            transform: translate(0, 2 *$boxWidth);
        }

        75% {
            transform: translate(0, 2 *$boxWidth);
        }
        77% {
            transform: translate(0, $boxWidth);
        }

        87.5% {
            transform: translate(0, $boxWidth);
        }
        89.5% {
            transform: translate(0, 0);
        }

        100% {
            transform: translate(0, 0);
        }
    }

    @keyframes gradient1 {
        from {
            stop-color: #4383b8;
        }
        50% {
            stop-color: #8013b9;
        }
        to {
            stop-color: #4383b8;
        }
    }

    @keyframes gradient2 {
        from {
            stop-color: #4aa06c;
        }
        50% {
            stop-color: #b22358;
        }
        to {
            stop-color: #4aa06c;
        }
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    #base-loader-loading {
        display: block;
        margin: auto;
        width: 20rem;
        height: auto;
        //transform : rotate(180deg);
        //animation: rotate @animationDuration / 2 linear 0s infinite;

        #gradient > stop[offset="0%"] {
            animation: gradient1 $animationDuration ease 0s infinite;
        }

        #gradient > stop[offset="100%"] {
            animation: gradient2 $animationDuration ease 0s infinite;
        }

        .rect {
            animation: slide $animationDuration ease infinite;
        }

        #rect1 {
            animation-delay: -0 * $animationStepDuration;
        }

        #rect2 {
            animation-delay: -1 * $animationStepDuration;
        }

        #rect3 {
            animation-delay: -2 * $animationStepDuration;
        }

        #rect4 {
            animation-delay: -3 * $animationStepDuration;
        }

        #rect5 {
            animation-delay: -4 * $animationStepDuration;
        }

        #rect6 {
            animation-delay: -5 * $animationStepDuration;
        }

        #rect7 {
            animation-delay: -6 * $animationStepDuration;
        }
    }
</style>
