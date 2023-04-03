<template>
    <div class="imagePreloader_components">
        <img :style="{ content: content }" class="imagePreloader_components">
    </div>
</template>

<script>
    export default {
        name: "ImagesPreloaderWrapper",
        data() {
            return {
                images: [
                    "/images/main/dice_play_inactive.png",
                    "/images/main/dice_play_active.png",
                    "/images/main/dice_create_inactive.png",
                    "/images/main/dice_create_active.png",
                    "/images/main/dice_local_inactive.png",
                    "/images/main/dice_local_active.png",
                    "/images/profile/winner2.png",
                    "/images/profile/winner.png",
                    "/images/profile/skyscrapers2.png",
                    "/images/profile/skyscrapers.png",
                    "/images/profile/billiard-ball2.png",
                    "/images/profile/billiard-ball.png",
                    "/images/main/crate.png",
                    "/images/profile/user-1.png",
                    "/images/profile/exchange2.png",
                    "/images/profile/exchange.png",
                    "/images/spectate/security-camera.png",
                    "/images/spectate/security-camera2.png",
                    "/images/spectate/twitch.png",
                    "/images/spectate/twitch2.png",
                    "/images/shop/credit-card.png",
                    "/images/shop/credit-card2.png",
                    "/images/shop/rasprodazha1.png",
                    "/images/shop/rasprodazha2.png",
                    "/images/shop/Loot-Boxes-Header1.png",
                    "/images/shop/Loot-Boxes-Header2.png",
                    "/images/shop/eight1.png",
                    "/images/shop/eight2.png",
                    "/images/shop/diamond-token1.png",
                    "/images/shop/diamond-token2.png"
                ],
                loadedImgs: []
            }
        },
        computed: {
            content() {
                return this.loadedImgs.length ? (this.loadedImgs.length > 1 ? 'url(' + this.loadedImgs.join(') url(') + ')' : 'url(' + this.loadedImgs[0] + ')') : ''
            }
        },
        mounted() {
            for(let i = this.images.length; i > 0; i--) {
                const img = new Image();
                const index = this.images.length - i;
                img.src = this.images[index];
                img.onload = () => {
                    this.loadedImgs.push(img.src);
                }
            }
        }
    }
</script>

<style>
    .imagePreloader_components {
        z-index: -1;
        width: 0;
        height: 0;
        position: fixed;
    }
</style>
