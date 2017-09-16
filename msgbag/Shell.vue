<template>
    <div>
        <slot name="contents" :messages="($msgbag._data.msgbags[_name] || {}).msgs"></slot>
    </div>
</template>

<script>
    export default {
        props: [
            'name',
            'timeout',
            'max'
        ],

        computed: {
            _name() {
                return this.name || 'global';
            },

            _max() {
                return this.max || 1;
            },

            _timeout() {
                return this.timeout || 2000;
            }
        },
        
        mounted() {
            this.$msgbag.option(this._name, 'max', this._max);
            this.$msgbag.option(this._name, 'timeout', this._timeout);
        }
    }
</script>