<template>
    <div v-show="show" class="w-modal-mask" v-on:click.stop="hide()" :transition="_transition">
        <div class="w-modal-close">x</div>

        <div class="w-modal-wrapper">
            <div class="w-modal-container">
                <div v-on:click.stop="nothing()">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['name', 'onShow', 'onHide', 'transition'],
        
        data: function () {
            return {
                show: false
            };
        },

        computed: {
            _transition() {
                return this.transition || 'slide-down';
            }
        },

        mounted() {
            var _this = this,
                name = this.$modal.register(this.name);

            this.$modal.watch(this.name, function (newVal, oldVal) {
                if (newVal === true && oldVal === false) {
                    if (_this.hasScrollbar()) {
                        document.body.style.paddingRight = '18px';
                    }
                    
                    document.body.style.overflow = 'hidden';

                    if (_this.onShow) { _this.onShow.call(_this, _this.name, _this.$modal.data(_this.name)); }
                }
                else if (newVal === false && oldVal === true) {
                    setTimeout(function () {
                        document.body.style.overflow = '';
                        document.body.style.paddingRight = '';
                    }, 450);

                    if (_this.onHide) {
                        _this.onHide.call(_this, _this.name, _this.$modal.data(_this.name));
                    }
                }
                
                // Make sure this runs last so that hasScrollbar func runs properly.
                _this.show = newVal;
            });
        },
        
        methods: {
            hasScrollbar() {

                // The Modern solution
                if (typeof window.innerWidth === 'number') {
                    return window.innerWidth > document.documentElement.clientWidth;
                }

                // KEEPING BELOW FOR REFERENCE

                // // rootElem for quirksmode
                // var rootElem = document.documentElement || document.body;

                // // Check overflow style property on body for fauxscrollbars
                // var overflowStyle;

                // if (typeof rootElem.currentStyle !== 'undefined') {
                //     overflowStyle = rootElem.currentStyle.overflow;
                // }

                // overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow;

                // // Also need to check the Y axis overflow
                // var overflowYStyle;

                // if (typeof rootElem.currentStyle !== 'undefined') {
                //     overflowYStyle = rootElem.currentStyle.overflowY;
                // }

                // overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;

                // var contentOverflows = rootElem.scrollHeight > rootElem.clientHeight;
                // var overflowShown    = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle);
                // var alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

                // return (contentOverflows && overflowShown) || (alwaysShowScroll);
            },

            hide() {
                this.$modal.hide(this.name);
            },

            nothing() {
                // null;
            }
        }
    }
</script>

<style>
    .w-modal-mask {
        position: fixed;
        z-index: 10000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .7);
        transition: opacity .3s ease;
        overflow-y: scroll;
    }
    .w-modal-mask > .w-modal-wrapper {
        display:table;
        margin: 0 auto;
        height: 100%;
        max-width: 800px;
        transition: margin-top .4s ease;
        overflow: hidden;
    }
    .w-modal-mask > .w-modal-wrapper > .w-modal-container {
        display:table-cell;
        vertical-align:middle;
    }
    .w-modal-mask > .w-modal-close {
        position: fixed;
        right: 30px;
        top: 10px;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
        font-family: verdana;
        cursor: pointer;
        z-index: 10001;
    }

    /* transitions */
    .slide-down-enter.w-modal-mask,
    .slide-down-leave.w-modal-mask {
        opacity: 0;
    }
    .slide-down-enter .w-modal-wrapper,
    .slide-down-leave .w-modal-wrapper {
        margin-top: -500px;
    }

    /*.center-pop-enter.vue-modal-mask,
    .center-pop-leave.vue-modal-mask {
        opacity: 0;
    }
    .center-pop-enter .vue-modal-wrapper,
    .center-pop-leave .vue-modal-wrapper {
        max-width: 0px;
    }*/
</style>