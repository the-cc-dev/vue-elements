<template>
    <div id="msgbag-{{ _name }}">
        <component
            :is="_component"
            v-if="$msgbag._data.msgbags[_name]"
            v-for="msg in $msgbag._data.msgbags[_name].msgs"
            :type="msg.type"
            :msg="msg.msg"
        >
        </component>
    </div>
</template>

<script>
    export default {
        props: [
            'name',
            'component',
            'timeout',
            'max'
        ],

        computed: {
            _name() {
                return this.name || 'global';
            },

            _component() {
                return this.component || 'el-alert';
            },

            _max() {
                return this.max || 1;
            }
        },
        
        ready() {
            this.$msgbag.option(this._name, 'max', this.max);
            this.$msgbag.option(this._name, 'timeout', this.timeout);
        }
    }
</script>