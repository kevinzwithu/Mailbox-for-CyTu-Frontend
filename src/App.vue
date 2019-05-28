<template>
    <div id="app">
        <div :style="style" ref="lavContainer"></div>
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
            setTimeout(() => {
                this.anim.play()
            }, 1500)
        },
        methods: {}
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        background: black;
        overflow: hidden;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        position: absolute;
    }
</style>
