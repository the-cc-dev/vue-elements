<template>    
    <form v-on:submit.prevent="formSubmit()" novalidate>
        <slot></slot>
    </form>
</template>

<script>
    export default {
        props: ['data', 'submit'],

        created() {
            if ( ! this.data.status) { Vue.set(this.data, 'status', null); }
            if ( ! this.data.body) { Vue.set(this.data, 'body', {}); }
            if ( ! this.data.errors) { Vue.set(this.data, 'errors', {}); }
        },

        methods: {
            formSubmit() {
                var _this = this,
                    success = this.data.success,
                    error = this.data.error;
                
                this.data.status = 'sending';

                this.data.success = function (res) {
                    _this.data.status = 'success';
                    
                    if (_this.data.clear === true) {
                        _this.data.body = {};
                    }

                    _this.data.errors = {};

                    if (success) { success.call(_this, res); }
                };
        
                this.data.error = function (res) {
                    _this.data.status = 'error';
                    _this.setErrors(res.data.errors);

                    if (error) { error.call(_this, res); }
                };

                this.submit(this.data);
            },

            setErrors(validationErrors) {
                var i, ii,
                    errors = {};

                validationErrors = validationErrors || [];

                for (i = 0, ii = validationErrors.length; i < ii; i++) {
                    if (!errors[validationErrors[i].field]) {
                        errors[validationErrors[i].field] = validationErrors[i].message;
                    }
                }

                this.data.errors = errors;
            }
        }
    }
</script>