<template>
    <div class="blog-wrap">
        <div v-for="item in items" :key="item.id" class="blog-entry">
            <a href="#" class="blog-title_avatar"></a>
            <div class="blog-title">
                <h3 class="blog-title_h3">
                    <a href="#">A Loving Heart is the Truest Wisdom</a>
                </h3>
                <div class="meta-wrap">
                    <p class="meta">
                    <span class="meta-span"><i class="calendar"></i>June 28, 2019</span>
                    <span class="meta-span"><i class="travel"></i>Travel</span>
                    <span class="meta-span"><i class="comments"></i>Comment</span>
                    </p>
                </div>
                <p class="blog-subtitle">
                    A small river named Duden flows by their place
                    and supplies it with the necessary regelialia.
                </p>
                <router-link to="#" class="link"><a class="read-more">Read more</a><i class="read-more_icon"></i></router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
        name: "BlogMain",
        data() {
            return {
                items: [
                    {
                        id: "1",
                        'title' : '1',
                        'body' : '2',
                    },
                    {
                        id: "2",
                        'title' : '1',
                        'body' : '2',
                    },
                    {
                        id: "3",
                        'title' : '1',
                        'body' : '2',
                    }
                ],
            }
        }
    }
</script>

<style scoped lang="scss">

    .blog-wrap {
        width: 100%;
        margin: 0 auto;
    }
        .blog-entry {
            width: 100%;
            display: flex;
            margin-bottom: 3em;
            margin-top: 3em;
            justify-content: center;
            text-align: left;
             }
            .blog-title_avatar {
                display: block;
                height:  150px;
                width: 150px;
                border-radius: 50%;

                background-size: cover;
                background-repeat: no-repeat;
                background-position: center center;
                background-image: url(https://cdn.pixabay.com/photo/2020/04/04/17/06/street-5003132_960_720.jpg);
                }
            .blog-title {
                width: 400px;
                position: relative;
                padding-left: 1.5rem;
                }
            .blog-title a{
                text-decoration: none;
                color: #bfbfbf; 
                cursor: pointer;
                  }
                .blog-title_h3 {
                    margin: 0px;
                    font-size: 30px;
                    line-height: 1.5;
                    }
                .blog-title_h3 a {
                    text-decoration: none;
                    color: #bfbfbf;
                    }

                .meta-wrap {
                    position: relative;
                    width: 100%;
                    display: block;
                }
                    .meta-span {
                        font-size: 14px;
                        margin: 0 10px 0 0;
                        color: #bfbfbf;
                         }
                    .calendar:before {
                        margin-right: 0.5rem;
                        content: "\f073";
                        }
                    .travel:before {
                        margin-right: 0.5rem;
                        content: "\f114";
                        }
                    .comments:before {
                        margin-right: 0.5rem;
                        content: "\e0b9";
                       }
                .blog-subtitle {
                        color: #bfbfbf;
                       }
                .read-more_icon:before {
                    margin-left: 0.2rem;
                    content: "\f3d1";
                }
</style>