<template>    
    <form v-on:submit.prevent="formSubmit()" novalidate>
        <slot></slot>
    </form>
</template>

<script>
    export default {
        props: ['data', 'submit'],

        methods: {
            formSubmit() {
                var _this = this;
                
                this.data.status = 'sending';

                this.data.success = function (res) {
                    _this.data.status = 'success';
                    
                    if (_this.data.clear === true) {
                        _this.data.body = {};
                    }

                    _this.data.errors = {};
                };
        
                this.data.error = function (res) {
                    _this.data.status = 'error';
                    _this.setErrors(res.data.errors);
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