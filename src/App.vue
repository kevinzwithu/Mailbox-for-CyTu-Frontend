<template>
    <div id="app">
        <div ref="lavContainer"></div>
        <div class="readme animated" v-if="isReadmeActive">
            <div class="readme-text animated delay-1s fadeIn">
                这个秘密邮箱是为音乐人Kevinz计划发行的“听后即焚”型数字音乐专辑搜集创作素材而设立的，<br />
                您投递进邮箱里的秘密可能被选为制作的题材，<br />
                并通过影像加音乐的方式演绎为一段不可复现的欣赏体验。
            </div>
        </div>
    </div>
</template>

<script>
    import lottie from 'lottie-web';
    import * as animationData from './assets/data'

    export default {
        name: 'app',
        mounted() {
            this.anim = lottie.loadAnimation({
                    container: this.$refs.lavContainer,
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    animationData: animationData.default
            });
            // eslint-disable-next-line no-console
            console.log(this.anim);
            this.startToPlay(1500);
        },
        data() {
            return {
                isReadmeActive: false
            }
        },
        methods: {
            startToPlay(waitTime) {
                setTimeout(() => {
                    this.anim.play();
                    this.displayDialog(9000);
                }, waitTime);
            },

            displayDialog(waitTime) {
                setTimeout(() => {
                    this.anim.pause();
                    this.isReadmeActive = true;
                }, waitTime)
            }
        }
    }
</script>

<style lang="stylus">
    #app
        font-family 'Avenir', Helvetica, Arial, sans-serif
        -webkit-font-smoothing antialiased
        -moz-osx-font-smoothing grayscale
        text-align center
        background black
        overflow hidden
        height 100%
        top 0
        left 0
        right 0
        position absolute

    .readme
        position absolute
        top 20%
        left 10%
        translate transform(0,-50%)
        height 60%
        width 80%
        background rgba(12,15,16,.7)
        border-radius 150px
        animation anim cubic-bezier(.36, 0, .64, 1)
        -webkit-animation anim cubic-bezier(.36, 0, .64, 1)
        display flex
        justify-content center
        align-items center
        .readme-text
            color white
            font-size 18px
            line-height 36px

    @keyframes anim
        from
            -webkit-transform scale3d(1, 0, 1)
            transform scale3d(1, 0, 1)
        to
            -webkit-transform scale3d(1, 1, 1)
            transform scale3d(1, 1, 1)

</style>
