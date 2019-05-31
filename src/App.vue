<template>
    <div id="app">
        <div ref="lavContainer"></div>
        <div class="readme animated loading" v-if="isReadmeActive"
             :class="{ finished: isDialogFinished }">
            <div class="readme-title animated" :class="{ fadeOut: isDialogFinished }">
                <div v-for="(page, i) in pages" :key="i" class="animated fadeIn delay-1s"
                     :class="{ hidden: currentPage !== i }" :ref="'title'+i">
                    {{page.title}}
                </div>
            </div>
            <div class="readme-text animated" :class="{ fadeOut: isDialogFinished }">
                <div v-for="(page, i) in pages" :key="i" class="animated fadeIn delay-2s"
                     :class="{ hidden: currentPage !== i }" :ref="'text'+i">
                    <span v-html="page.content"></span>
                </div>
                <div class='finish-btn animated delay-4s fadeIn slow'
                     @click='finishDialog' v-if="currentPage === pages.length - 1">start
                </div>
            </div>
            <div class="dots animated" :class="{ fadeOut: isDialogFinished }">
                <div class="dots-box animated delay-3s fadeIn">
                    <div v-for="(page, i) in pages" :key="i"
                         class="dot" :ref="'dot'+i"
                         :class="{'dot-active': currentPage === i, 'dot-hidden': maxPage < (i-1)}"
                         @click="changeCurrentPageTo(i)"></div>
                </div>
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
                changePageWaitPeriod: 5000,
                dialogEnterTime: 6500,
                dialogExitTime: 10500,
                isReadmeActive: false,
                isDialogFinished: false,
                canUserHandle: false,
                currentPage: -1,
                maxPage: -1,
                pages: [
                    {
                        title: "邮箱设立的目的",
                        content: "这个秘密邮箱是为音乐人Kevinz计划发行的“听后即焚”型数字音乐专辑搜集创作素材而设立的，<br />" +
                            "您投递进邮箱里的秘密可能被选为制作的题材，<br />" +
                            "并通过影像加音乐的方式演绎为一段不可复现的欣赏体验。"
                    }, {
                        title: "“听后即焚”型数字音乐专辑是什么?",
                        content: "根据目前可以透露的信息，它将是一份呈现方式相对特殊，糅合了多种视听媒介的付费数字音乐专辑。<br />" +
                            "我们十分用心地设计了这个秘密邮箱网页作为先导环节，希望您可以积极地参与到我们的整个创作过程中，<br />" +
                            "让这个特殊的作品在各种意义上成为您与我们之间交流互动痕迹的留存。"
                    }, {
                        title: "在开始您的讲述之前，请先阅知这些基本的要求:",
                        content: "<ol>" +
                            "<li>本树洞实行不记名制度。您无需在投稿中注明自己的身份，同时也不必在您的讲述过程中提及任何现实生活中存在的真实人名、地点、社会团体名称等信息。<br />若必须提及，请尽量使用如 ABCD 或甲乙丙丁之类的代号。</li>" +
                            "<li>您可以写您认为适合写出来，并希望我们将其演绎成音乐作品的任何真事，不需考虑故事是否符合我们的期待。<br />无论是精彩的故事，还是一段平淡而细致动人的回忆；无论是您日久天长仍不能忘怀的往事，还是正发生在当下未完的事，或甚至是发生在您的亲友身上的故事，只要您愿意将您的故事讲给我们听，我们就会扮演您忠实的沉默听众。</li>" +
                            "<li>请务必把真实，也就是客观上发生过或正在发生的故事写给我们。被我们认定有以下问题的投稿，被优先采纳的可能性会极大地降低：<ul>" +
                            "<li>有过于明显的虚构痕迹，或从头至尾都是明显的幻想故事的；</li>" +
                            "<li>用语晦涩难懂，或行文同现代汉语差距过大，导致阅读困难的；</li>" +
                            "<li>叙述逻辑混乱，导致理解困难的；</li>" +
                            "<li>用制作组掌握范围之外的语种叙述的。</li></ul></li>" +
                            "<li>如果您的故事涉及任何在现实生活中发生过的违法犯罪活动，希望您三思后再投稿。设立这条规定的理由可以参考经典辩论题目“神父听了杀人犯的告解后该不该报警”——当然我们不是自比神父，只是意在说明我们不希望陷入这种两难境地。请您务必给予理解。</li>" +
                            "<li>为了尽量收集到有意义的投稿，并且保证投稿中有一定细节可供创作参考，我们设置了最低字数限制（100字），请您尽量不要讲得太简略。同时，恶意灌水（譬如无意义的文字组合、乱码、表白信、催稿信等与征集主题不相关的内容）是不允许的。</li>" +
                            "<li>为了方便后续联系，建议您尽量留下一个不致暴露自己身份的联系方式（仅支持邮箱及中国大陆手机号码）。您也可以选择不留任何联系方式。</li>" +
                            "</ol>"
                    }, {
                        title: "",
                        content: "本使用说明之版权以及其修改权、更新权及最终解释权均属 Kevinz 个人所有。 Kevinz 及制作组其他成员保留在未经事先声明的情况下修改本声明的权利。<br />如您仍有本使用说明未能解答的问题，可以通过网站给出的联系方式询问 Kevinz 本人。"
                    }, {
                        title: "",
                        content: "十分感谢您的耐心阅读。<br />请开始讲您的故事吧，我们在听。"
                    }
                ]
            }
        },
        watch: {
            currentPage(val) {
                if (val > this.maxPage) {
                    setTimeout(() => {
                        this.maxPage = val;
                    }, this.changePageWaitPeriod);
                }
                setTimeout(() => {
                    this.canUserHandle = true;
                }, 1000); // to wait the delay-1s
            }
        },
        methods: {
            startToPlay(waitTime) {
                setTimeout(() => {
                    this.anim.play();
                    this.displayDialog(this.dialogEnterTime);
                }, waitTime);
            },

            displayDialog(waitTime) {
                setTimeout(() => {
                    this.anim.pause();
                    this.currentPage++;
                    this.isReadmeActive = true;
                }, waitTime)
            },

            changeCurrentPageTo(i) {
                const cp = this.currentPage;
                if ((i !== cp) && this.canUserHandle) {
                    this.canUserHandle = false;
                    this.$refs[`dot${cp}`][0].classList.remove("dot-active");
                    this.$refs[`text${cp}`][0].classList.remove("delay-2s");
                    this.$refs[`title${cp}`][0].classList.remove("delay-1s");
                    this.$refs[`text${cp}`][0].classList.add("fadeOut");
                    this.$refs[`title${cp}`][0].classList.add("fadeOut");
                    setTimeout(() => {
                        this.currentPage = i;
                    }, 1000);
                }
            },

            finishDialog() {
                this.anim.goToAndPlay(this.dialogExitTime);
                this.canUserHandle = false;
                this.isDialogFinished = true;
                setTimeout(() => {
                    this.isReadmeActive = false;
                    this.canUserHandle = true;
                }, 2000);
            }
        }
    }
</script>

<style lang="stylus">
    red-gradient = linear-gradient(to right bottom, rgba(255, 0, 0, .6), rgba(255, 0, 0, .9))
    cyan-gradient = linear-gradient(to right bottom, rgba(0, 255, 255, .6), rgba(0, 255, 255, .9))

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
        height calc(60% - 160px)
        width 66%
        background rgba(12, 15, 16, .9)
        border-radius 150px
        animation anim 1s cubic-bezier(.46, 0, .54, 1) forwards
        -webkit-anismation anim 1s cubic-bezier(.46, 0, .54, 1) forwards
        display flex
        justify-content space-between
        align-items center
        flex-direction column
        padding 80px 7%

        &.finished
            animation anim-reverse 2s cubic-bezier(.46, 0, .54, 1) forwards !important
            -webkit-animation anim-reverse 2s cubic-bezier(.46, 0, .54, 1) forwards !important

            .finish-btn, .finish-btn:hover
                background red-gradient !important

        & > div > div.hidden
            display none

        & > .readme-title
            color white
            font-size 28px
            font-weight bold

        & > .readme-text
            color rgba(255, 255, 255, .8)
            font-size 18px
            line-height 40px
            overflow auto
            margin 60px 0

            ol
                text-align left
                margin 0 7%

                li
                    margin-bottom 30px

                    & > ul > li
                        margin-bottom 0

            .finish-btn
                background cyan-gradient
                border-radius 20px
                padding 5px 30px
                margin-top 60px
                cursor pointer

                &:hover
                    background red-gradient


        & > .dots > .dots-box
            display flex
            flex-direction row

            & > .dot
                border-radius 100%
                height 10px
                margin 0 30px
                width @height
                border 1px solid white
                opacity 1
                transition 1s
                cursor: pointer

                &.dot-active
                    background white
                    transition 1s

                &.dot-hidden
                    opacity 0
                    transition 1s
                    cursor inherit

    @media screen and (max-width: 1440px)
        .readme > .readme-text
            line-height 30px
            margin 40px 0
            font-size 15px

        @keyframes anim
            from
                -webkit-transform scale3d(1, 0, 1)
                transform scale3d(1, 0, 1)
            to
                -webkit-transform scale3d(1, 1, 1)
                transform scale3d(1, 1, 1)

        @keyframes anim-reverse
            from
                -webkit-transform scale3d(1, 1, 1)
                transform scale3d(1, 1, 1)

            50%
                -webkit-transform scale3d(1, 1, 1)
                transform scale3d(1, 1, 1)

            to
                -webkit-transform scale3d(1, 0, 1)
                transform scale3d(1, 0, 1)
</style>
