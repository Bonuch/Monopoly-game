<template>
    <div class="blog">
        <p class="blog-title">{{ $t("CONTACTS.Блог") }} <span class="notification_container">
            <slot></slot>
        </span></p>
        <div class="preview">
            <div class="inner">
                <div class="title">
                    <span>New custom rules<br>and game balance</span>
                </div>
                <router-link to="/play/blog" class="link">{{ $t("CONTACTS.Узнать") }}</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "BlogPreview",
};
</script>

<style scoped lang="scss">
.notification_container {
    display: flex;
    align-items: center;
}
.blog {
    position: relative;
    //flex: 0 1 305px;
    //min-height: 305px;
    padding: 15px 15px 45px 15px;
    text-align: left;
    box-sizing: border-box;

    .blog-title {
        color: #fff;
        display: flex;
        margin: 5px 0;
        justify-content: space-between;
        font-size: 19px;
        line-height: 22px;
        font-weight: 500;
    }

    .preview {

        position: relative;
        background-image: url("/design/blog/blog-preview.jpg");
        background-position: 50% 20%;
        background-size: 140%;
        height: 150px;
        border-radius: 10px;
        @media only screen and (min-width: 1721px) {
            height: 223px;
        }

        .inner {
            position: absolute;
            top: 25px;
            left: 10px;
            @media only screen and (min-width: 1721px) {
                top: 50px;
            }

            .title {
                background: rgba(27, 27, 27, 0.55);
                border-radius: 7px;
                padding: 7px 10px;
                margin-bottom: 10px;

                span {
                    font-size: 14px;
                    line-height: 17px;
                    font-weight: 500;
                    color: #FFFFFF;
                    @media only screen and (min-width: 1721px) {
                        font-size: 20px;
                        line-height: 28px;
                    }
                }
            }

            .link {
                display: inline-block;
                padding: 18px 60px;
                background: #ECF0F1;
                box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.14);
                border-radius: 4px;
                margin-left: 10px;
                font-size: 19px;
                line-height: 16px;
                color: #000000;
                text-decoration: none;
                color: #fff;
                background: #381B66;
            }
        }
    }
}
</style>
