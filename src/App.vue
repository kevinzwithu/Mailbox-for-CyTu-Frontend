<template>
    <div id="app" class="animated fadeIn">
        <div class="DEBUG"></div>
        <div ref="lavContainer" v-show="isBrowserSupported" class="bg-anime" id="bg"></div>
        <div class="readme animated loading" v-if="isReadmeActive"
             :class="{ mobile: isUsingMobile, finished: isDialogFinished }">
            <div class="readme-title animated" :class="{ fadeOut: isDialogFinished }">
                <div v-for="(page, i) in pages" :key="i" class="animated fadeIn delay-1s"
                     :class="{ hidden: currentPage !== i }"
                     :ref="'title'+i">
                    {{page.title}}
                </div>
            </div>
            <div class="readme-text animated" @scroll="scrollDialogText($event)"
                 :class="{ fadeOut: isDialogFinished }" ref="readmeText">
                <div v-for="(page, i) in pages" :key="i" class="animated fadeIn"
                     :class="{ 'delay-1s': !page.title.length, 'delay-2s': page.title.length, hidden: currentPage !== i }"
                     :ref="'text'+i">
                    <span v-html="page.content"></span>
                </div>
                <div class='finish-btn animated delay-3s fadeIn slow'
                     @click='finishDialog' v-if="currentPage === pages.length - 1">start
                </div>
            </div>
            <div class="dots animated" :class="{ fadeOut: isDialogFinished }">
                <div class="dots-box animated delay-3s lampIn">
                    <div v-for="(_, i) in pages" :key="i"
                         class="dot" :ref="'dot'+i"
                         :class="{ mobile: isUsingMobile, 'dot-active': !currentPage, 'dot-hidden': currentPage }"
                         @click="changeCurrentPageTo(0)"></div>i
                </div>
            </div>
        </div>
        <div class="secret animated fadeIn delay-1s" :class="{ mobile: isUsingMobile }"
             v-if="isSecretActive"
             :style="{ height: isUsingMobile ? (screenWidth * 16 / 9 * 0.75 + 'px') : (screenWidth * 9 / 16 * 0.86 + 'px') }">
            <div class="secret-input animated" :class="{ fadeOut: isFormSubmit }">
                <label for="secret"></label>
                <textarea placeholder="（请在这里，讲述您的故事吧。）" maxlength="40000"
                          v-model="secretText" id="secret" autofocus="autofocus"
                          :disabled="!canUserHandle"></textarea>
            </div>
            <div class="info-inputs animated" :class="{ fadeOut: isFormSubmit }">
                <!--                <div class="info-input animated fadeIn delay-5s">-->
                <!--                    <label for="userName">或许你想留下一个称呼吗？</label>-->
                <!--                    <input type="text" name="userName" id="userName" v-model="userName" :disabled="!canUserHandle"/>-->
                <!--                </div>-->
                <div class="info-input animated fadeIn delay-4s">
                    <label for="userContact" :class="{ invalid: !isUserContactValid }">您的联系方式（可不填）</label>
                    <input type="text" name="userContact" id="userContact" v-model="userContact"
                           :disabled="!canUserHandle"/>
                </div>
                <div class="info-input with-btn animated fadeIn delay-3s">
                    <label class="animated fast fadeIn"
                           v-if="isTextLengthValid">
                        {{secretLengthStr}}</label>
                    <div class="submit-button" @click="submit"
                         :class="{ active: isTextLengthValid, busy: isTextLengthValid && (!canUserHandle || !isUserContactValid) }">
                        <p v-if="isTextLengthValid">OK</p>
                        <p v-if="!isTextLengthValid">{{secretLengthStr}} / {{minSecretTextLength}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="finish-text animated fadeIn delay-5s" v-if="isFormSubmit" ref="finishText">
            <p>我们已经收到您的故事。</p>
            <div class="new-letter" @click="createNewLetter">再投一封</div>
        </div>
        <div class="test-box" v-if="!isBrowserSupported">抱歉，本站目前不支持IE及Edge浏览器。<br/>对此带来的不便深表歉意。请使用其他浏览器访问。</div>
        <div class="wall" v-if="isWaiting" @click="getUserClick"
             :style="{
                height: isUsingMobile ? (screenWidth / 9 * 16 + 'px') : (screenWidth * 0.02813 + 'px'),
                top: isUsingMobile ? '0' : (screenWidth * 0.22331 + 'px'),
                left: isUsingMobile ? '0' : '38.92%',
                right: isUsingMobile ? '0' : '41.5%',
                background: isUsingMobile ? 'linear-gradient(rgba(255,255,255,.3), rgba(255,255,255,.9))' : 'linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.9))'
             }"></div>
    </div>
</template>

<script>
    import lottie from 'lottie-web';
    import qs from 'qs';
    import * as animationData from '../public/data'
    import * as animationDataMB from '../public/datamb'

    export default {
        name: 'app',
        mounted() {
            // this.isUsingMobile = document.documentElement.clientWidth < document.documentElement.clientHeight;
            this.isUsingMobile = this.judgeUsingMobile();
            this.anim = lottie.loadAnimation({
                container: this.$refs.lavContainer,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                animationData: (this.isUsingMobile ? animationDataMB : animationData).default
            });
            let userAgent = navigator.userAgent;
            if ((userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1) && (userAgent.indexOf("Opera") <= -1)
                || window.ActiveXObject || "ActiveXObject" in window
                || userAgent.indexOf("Edge") > -1) return;
            this.isBrowserSupported = true;
            if (this.isUsingMobile) {
                this.openingBlackOutPeriod = 0;
                this.zoomToMailboxTime = 4550;
            }
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth;
                    this.screenWidth = window.screenWidth;
                })()
            };
            this.startToPlay(this.openingBlackOutPeriod);
        },
        data() {
            return {
                mobileMailboxLeft: '30.5%',
                mobileMailboxRight: '29.6%',
                mobileMailboxTop: "screenWidth * 0.71111 + 'px'",
                mobileMailboxHeight: "screenWidth * 0.04275 + 'px'",
                minSecretTextLength: 100,
                changePageWaitPeriod: 5000,
                openingBlackOutPeriod: 1500,
                zoomToMailboxTime: 3250,
                dialogEnterTime: 6500,
                dialogExitTime: 10600,
                formEnterTime: 17000,
                formExitTime: 18500,
                isUsingMobile: false,
                isWaiting: false,
                isBrowserSupported: false,
                isReadmeActive: false,
                isSecretActive: false,
                isDialogFinished: false,
                isFormSubmit: false,
                isScrolledToBottom: true,
                canUserHandle: false,
                currentPage: -1,
                maxPage: -1,
                screenWidth: document.body.clientWidth,
                pages: [
                    {
                        title: "欢迎您，前来寄信的客人。",
                        content: "我们深知您可能有想要传达的秘密，<br />" +
                            "但遗憾的是，青色深流企划的秘密邮箱阶段已经于2020年2月14日截止。<br />" +
                            "<span class='animated delay-4s fadeIn'>感谢您对我们的关注和支持，<br />" +
                            "这个企划将会于2020年内释出更多相关的信息，请您和我们一同见证它的成长。</span>"
                    }, {
                        title: "欢迎您，前来寄信的客人。",
                        content: "我们的秘密邮箱——也就是您眼前的这座邮筒，<br />" +
                            "是为 Kevinz 计划发行的<strong>“听后即焚”型数字音乐专辑</strong>搜集创作素材而设立的。<br />" +
                            "<span class='animated delay-4s fadeIn'>如果您愿意将您的秘密投递到这里，它将有可能被选为制作的题材，<br />" +
                            "并通过影像加音乐的方式演绎为一段<strong>不可复现</strong>的欣赏体验。</span>"
                    }, {
                        title: "这是一张怎样的专辑？",
                        content: "目前可以透露的信息是，这将是一份呈现方式相对特殊，并糅合多种视听媒介的付费数字专辑。<br />" +
                            "而它的全部内容和灵感，都将以这座信箱中收集到的稿件作为来源。<br />" +
                            "<span class='animated delay-5s fadeIn'>通过这个秘密邮箱，您和其他秘密的持有者都可以参与到我们的整个创作过程中，<br />" +
                            "让这个特殊的作品在各种意义上成为您与我们之间联结痕迹的留存。</span>"
                    }, {
                        title: "在开始您的讲述之前，请先阅知这些基本的要求：",
                        content: "<ol>" +
                            "<li>秘密邮箱实行<strong>不记名制度</strong>。<br />您无需在投稿中注明自己的身份，同时也请尽量避免在讲述过程中提及任何现实生活中存在的真实人名、地点、社会团体名称等信息。<br />若必须提及，请尽量使用如 ABCD 或甲乙丙丁之类的代号。</li>" +
                            "<li>只要您有认为适合写出来、并希望我们将其演绎成音乐作品的秘密和故事，您就可以在这里投递稿件。我们不会对内容的题材、体裁、叙述方式等作任何限制，您也完全不需考虑它是否符合我们的期待。<br />无论是精彩跌宕的情节，还是一段平淡而细致动人的回忆；无论是您日久天长仍不能忘怀的心绪，还是正发生在当下未完的牵绊——只要您愿意将您的秘密故事讲给我们，我们就会做您忠实的沉默听众。</li>" +
                            "<li>请务必保证故事的真实性。被我们认定有以下状况的投稿，被优先采纳的可能性会较大程度地降低：<ul>" +
                            "<li>有过于明显的虚构痕迹，或从头至尾都是明显的幻想故事；</li>" +
                            "<li>用语晦涩难懂，或行文同现代汉语差距过大；</li>" +
                            "<li>叙述逻辑混乱，导致理解困难；</li>" +
                            "<li>用制作组掌握范围之外的语种叙述。</li></ul></li>" +
                            "<li>如果您的故事涉及任何在现实生活中发生过的违法犯罪活动，希望您仔细斟酌是否应该投稿。设立这条规定的理由可以参考经典辩论题目“神父听了杀人犯的告解后该不该报警”——当然我们并非自比神父，仅仅意在说明我们不希望陷入这种两难境地。请您务必给予理解。</li>" +
                            `<li>为了尽量收集到高质量的投稿、并且保证投稿中有一定细节可供创作参考，我们设置了<strong>最低字数限制</strong>（100字），希望您可以更加全面完善、更加细腻地讲述它。同时，恶意灌水的情况（譬如无意义的文字组合、乱码、表白信、催稿信等与征集主题不相关的内容）会被取消参与资格，情况严重者会列入黑名单。</li>` +
                            "<li>为了方便后续联系，建议您尽量留下一个不致暴露自己身份的联系方式（目前仅支持填写邮箱或中国大陆手机号码）。您也可以选择不留任何联系方式。</li>" +
                            "</ol>"
                    }, {
                        title: "收到您的投稿后，我们承诺:",
                        content: "<ol>" +
                            "<li>我们将<strong>逐条仔细阅读所有投稿</strong>，您不必担心自己的故事会湮没在其他投稿中。</li>" +
                            "<li>您的投稿原文及您留下的联系方式等信息将被永久封存，<strong>不会以任何方式公开</strong>。如有必要，我们也会采取其他手段来保障整个投信过程的绝对私密性。</li>" +
                            "<li>如果您的投稿被选为创作及后期宣发材料的题材，我们将会对您的投稿作一定程度的艺术加工，在不妨害创作自由的基础上，保证您的身份不被相关者轻易猜到。" +
                            "<li>如果您的投稿被选为创作及后期宣发材料的题材，同时您选择了留下有效联系方式，开售后我们将通过您的联系方式为您<strong>免费提供专辑和制作组的礼物</strong>，以表示谢意。</li>" +
                            "<li>您的讲述对我们而言绝不是可有可无的参考；相反，每一个秘密都将会被我们最大化利用，最终呈现出的绝大多数故事情节都将来自您和其他人的投稿。</li>" +
                            "</ol>"
                    }, {
                        title: "",
                        content: "本使用说明之版权以及其修改权、更新权及最终解释权均属 Kevinz 个人所有。<br /> Kevinz 及制作组其他成员保留在未经事先声明的情况下修改本声明的权利。<br />如您仍有本使用说明未能解答的问题，可以通过网站给出的联系方式询问 Kevinz 本人。"
                    }, {
                        title: "",
                        content: "十分感谢您的耐心阅读。<br />请开始讲述您的故事吧，我们在听。"
                    }
                ],
                userName: "",
                userContact: "",
                secretText: ""
            }
        },
        watch: {
            currentPage(val) {
                setTimeout(() => {
                    if (this.$refs.readmeText) {
                        this.$refs.readmeText.scrollTop = 0;
                        this.isScrolledToBottom =
                            (this.$refs.readmeText.scrollHeight <= this.$refs.readmeText.clientHeight);
                    }
                    if (this.isScrolledToBottom) {
                        this.updatePagesLength(val);
                    }
                    this.canUserHandle = true;
                }, 1000);
            },

            userName(val) {
                const r = /[^.,\-_，。？！：；a-zA-Z0-9\u4E00-\u9FA5]/g;
                if (!r.test(val)) this.userName = val.replace(r, '')
            }
        },
        computed: {
            secretTextLength() {
                return this.secretText.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "").length
            },

            isTextLengthValid() {
                return this.secretTextLength >= this.minSecretTextLength
            },

            secretLengthStr() {
                return this.isTextLengthValid
                    ? this.secretTextLength
                    : (Array(3).join('0') + this.secretTextLength).slice(-3);
            },

            isUserContactValid() {
                return this.userContact === ""
                    || /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,7})$/.test(this.userContact)
                    || /^1[3|4|5|7|8|9]\d{9}$/.test((this.userContact));
            }
        },
        methods: {
            judgeUsingMobile() {
                let ua = navigator.userAgent;
                let ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
                    isIphone =!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
                    isAndroid = ua.match(/(Android)\s+([\d.]+)/);
                return (isIphone || isAndroid)
            },

            startToPlay(waitTime) {
                setTimeout(() => {
                    this.anim.play();
                    this.waitForUserClick(this.zoomToMailboxTime);
                }, waitTime);
            },

            waitForUserClick(waitTime) {
                setTimeout(() => {
                    this.anim.pause();
                    this.isWaiting = true;
                }, waitTime)
            },

            getUserClick() {
                this.isWaiting = false;
                this.anim.play();
                this.displayDialog(this.dialogEnterTime - this.zoomToMailboxTime);
            },

            displayDialog(waitTime) {
                setTimeout(() => {
                    this.anim.pause();
                    this.isReadmeActive = true;
                    this.currentPage = 0;
                }, waitTime)
            },

            displaySecretForm(waitTime) {
                setTimeout(() => {
                    this.anim.pause();
                    this.isSecretActive = true;
                }, waitTime)
            },

            changeCurrentPageTo(i) {
                if (i - 1 > this.maxPage) return;
                const cp = this.currentPage;
                if ((i !== cp) && this.canUserHandle) {
                    this.canUserHandle = false;
                    this.$refs[`dot${cp}`][0].classList.remove("dot-active");
                    this.$refs[`text${cp}`][0].classList.remove("delay-2s");
                    this.$refs[`text${cp}`][0].classList.remove("delay-1s");
                    this.$refs[`title${cp}`][0].classList.remove("delay-1s");
                    this.$refs[`text${cp}`][0].classList.add("fadeOut");
                    this.$refs[`title${cp}`][0].classList.add("fadeOut");
                    setTimeout(() => {
                        this.currentPage = i;
                        this.$refs.readmeText.scrollTop = 0;
                    }, 1000);
                }
            },

            scrollDialogText(ev) {
                if (this.isReadmeActive) {
                    const e = ev.target;
                    if (e.scrollHeight - 5 <= e.scrollTop + e.clientHeight)
                        this.updatePagesLength(this.currentPage, 0);
                }
            },

            updatePagesLength(val, period = this.changePageWaitPeriod) {
                (val > this.maxPage) && setTimeout(() => {
                    this.maxPage = val;
                }, period);
            },

            finishDialog() {
                this.anim.goToAndPlay(this.dialogExitTime);
                this.canUserHandle = false;
                this.isDialogFinished = true;
                setTimeout(() => {
                    this.isReadmeActive = false;
                    this.canUserHandle = true;
                }, 2000);
                this.displaySecretForm(this.formEnterTime - this.dialogExitTime);
            },

            submit() {
                // API endpoint is unable to connect from 2020.2.15.
                // No need to try it :)

                if (!this.canUserHandle || !this.isUserContactValid || !this.isTextLengthValid) return;
                this.canUserHandle = false;
                this.$axios.post(`/mailbox`, qs.stringify({
                    userName: this.userName,
                    userContact: this.userContact,
                    secretText: this.secretText
                })).then(res => {
                    const data = res.data;
                    if (data.status === "ok") {
                        this.anim.goToAndPlay(this.formExitTime);
                        this.isFormSubmit = true;
                        setTimeout(() => {
                            this.isSecretActive = false;
                            this.canUserHandle = true;
                        }, 1000);
                    } else throw `Error ${data.errCode}: ${data.errMsg}`
                }).catch(error => {
                    // eslint-disable-next-line no-console
                    console.error(error);
                    this.canUserHandle = true;
                });
            },

            createNewLetter() {
                this.anim.setDirection(-1);
                this.anim.play();
                this.secretText = "";
                this.$refs.finishText.classList.remove("delay-5s");
                this.$refs.finishText.classList.add("fadeOutDownBig");
                setTimeout(() => {
                    this.anim.pause();
                    this.anim.setDirection(1);
                    this.isFormSubmit = false;
                    this.isSecretActive = true;
                }, 7000);
            }
        }
    }
</script>

<style lang="stylus">
    @import "../public/fonts/fonts.css"

    red-gradient = linear-gradient(to right bottom, rgba(255, 0, 0, .6), rgba(255, 0, 0, .9))
    cyan-gradient = linear-gradient(to right bottom, rgba(0, 255, 255, .6), rgba(0, 255, 255, .9))

    title-font = 'serif-m', '\5b8b\4f53', Serif
    content-font = Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Noto Sans S Chinese", "sans-r", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif
    strong-font = Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "sans-b", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif

    #app
        font-family content-font
        -webkit-font-smoothing antialiased
        -moz-osx-font-smoothing grayscale
        text-align center
        background black
        overflow hidden
        min-height 100%
        min-width 100%
        top 0
        left 0
        right 0
        position absolute

    .DEBUG
        display none
        position absolute
        z-index 9
        top -140px
        bottom 0
        left 0
        right 0
        width 100%
        height 100%
        background red
        background-size cover

    .test-box
        color white
        padding-top 50px

    .wall
        position absolute
        top 0
        z-index 11
        cursor pointer
        opacity 0
        transition .3s

        &:hover, &:active
            opacity .2
            transition .1s

    br
        line-height 3

    .readme
        position absolute
        top 20%
        left 10%
        height calc(60% - 160px)
        width 66%
        background rgba(12, 15, 16, .9)
        border-radius 150px
        animation anim 1s cubic-bezier(.46, 0, .54, 1) forwards
        -webkit-animation anim 1s cubic-bezier(.46, 0, .54, 1) forwards
        -moz-animation anim 1s cubic-bezier(.46, 0, .54, 1) forwards
        -o-animation anim 1s cubic-bezier(.46, 0, .54, 1) forwards
        display flex
        justify-content space-between
        align-items center
        flex-direction column
        padding 80px 7%

        &.finished
            animation anim-reverse 2s cubic-bezier(.46, 0, .54, 1) forwards !important
            -webkit-animation anim-reverse 2s cubic-bezier(.46, 0, .54, 1) forwards !important
            -moz-animation anim-reverse 2s cubic-bezier(.46, 0, .54, 1) forwards !important
            -o-animation anim-reverse 2s cubic-bezier(.46, 0, .54, 1) forwards !important

            .finish-btn, .finish-btn:hover
                background red-gradient !important

        & > div > div.hidden
            display none

        & > .readme-title
            color white
            font-size 28px
            font-weight bold
            font-family title-font

        & > .readme-text
            color rgba(255, 255, 255, .8)
            font-size 18px
            line-height 40px
            overflow auto
            margin 60px 0

            strong
                font-family strong-font
                color cadetblue
                margin 0 3px

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

        &.mobile
            border-radius 10px
            background rgba(12, 15, 16, .7)
            left 3%
            top 10%
            width 80%
            padding 40px 7%
            height calc(60% - 80px)

            & > .readme-title
                font-size 20px

            & > .readme-text
                font-size 14px


        & > .dots > .dots-box
            display flex
            flex-direction row

            & > .dot
                /*border-radius 100%*/
                transform rotate(30deg)
                height 18px
                margin 0 60px
                width @height
                border 1px solid white
                opacity .8
                transition 1s
                cursor pointer

                &.mobile
                    margin 0 20px
                    height 14px
                    width @height

                &.dot-active
                    background white
                    transition 1s
                    opacity 1
                    cursor inherit

                &.dot-hidden
                    opacity 0
                    transition 1s
                    cursor inherit
                    animation none


    @media screen and (max-width: 1440px)
        .readme > .readme-text
            line-height 30px
            margin 40px 0
            font-size 15px

    @media screen and (max-width: 350px)
        .secret.mobile > .info-inputs
            align-items center

    .secret
        position absolute
        width 66%
        /*height 86%*/
        top 0
        bottom 0
        left 7px
        right 0
        margin 0 17%
        z-index 10
        display flex
        flex-direction column
        align-items stretch

        & > .secret-input
            flex 9 1 auto
            padding-top 13%

            textarea
                width 100%
                height 100%
                font-size 18px
                background none
                border none
                outline none
                line-height 38px
                color cadetblue
                transition .5s

                &:focus
                    color white
                    transition .5s

        & > .info-inputs
            flex 1 0 auto
            display flex
            flex-direction row
            align-items flex-end
            justify-content space-between
            width 100%

            label
                color darkcyan
                font-size 12px
                margin 5px 0
                transition .5s

                &.invalid
                    color darkred
                    transition .5s

            & > .info-input
                flex 1 0 auto
                display flex
                flex-direction column
                align-items flex-start
                margin 0 10px

                &.with-btn
                    flex 0 1 auto
                    margin 0

                input
                    width 80%
                    outline none
                    border none
                    background rgba(0, 0, 0, .4)
                    font-size 20px
                    padding 8px 16px
                    color rgba(255, 255, 255, .5)
                    transition .5s

                    &:focus
                        color white
                        transition .5s

                .submit-button
                    background none
                    padding 0 10px
                    height 39px
                    transition .5s background

                    p
                        margin 10px 10px 0 10px
                        font-size 14px
                        color darkcyan
                        transition .5s color

                    &.active
                        padding 0 26px
                        background darkcyan
                        transition .5s background
                        cursor pointer

                        &:hover
                            background darkred

                        p
                            margin-top 11px
                            color gainsboro
                            transition .5s color

                    &.busy, &.busy:hover
                        cursor inherit
                        background grey
                        transition .5s background

        &.mobile
            top 150px
            left 2px
            margin 0 12%
            width 76%

            & > .secret-input
                flex 9 1 auto
                padding-top 13%

            textarea
                font-size 14px
                line-height 28px

            & > .info-inputs
                flex-direction row

                label
                    color darkcyan
                    font-size 9px

                & > .info-input
                    flex 1 1 auto
                    text-align left
                    display flex
                    flex-direction column
                    align-items flex-start
                    margin 0 10px

                    input
                        font-size 16px

                    .submit-button
                        height 33px

                    &.with-btn
                        flex 1 0 auto
                        align-items flex-end

    .finish-text
        position absolute
        left 0
        right 0
        width 100%
        top 80%
        color darkcyan
        font-size 14px
        display flex
        flex-direction row
        align-items center
        justify-content center

        .new-letter
            background cadetblue
            color antiquewhite
            cursor pointer
            padding 10px 25px
            margin 0 25px

    @-webkit-keyframes lamp
        from
            opacity 0

        2%
            opacity 1

        4%
            opacity 0

        10%
            opacity 0

        12%
            opacity 1

        14%
            opacity 0

        50%
            opacity 0

        to
            opacity 1


    @keyframes lamp
        from
            opacity 0

        2%
            opacity 1

        4%
            opacity 0

        10%
            opacity 0

        12%
            opacity 1

        14%
            opacity 0

        50%
            opacity 0

        to
            opacity 1

    .lampIn
        -webkit-animation-name lamp
        -webkit-animation-duration 2s !important
        animation-name lamp
        animation-duration 2s !important

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
