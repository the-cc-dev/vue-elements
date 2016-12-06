<template>    
    <form v-on:submit.prevent="formSubmit()" novalidate>
        <slot></slot>
    </form>
</template>

<script>
    export default {
        props: ['data', 'submit', 'validate', 'validator'],

        methods: {
            formSubmit() {
                var _this = this,
                    isValid = false,
                    validate = this.validate || this.$parent.$validate,
                    validator = this.validator || this.$parent.$validator;

                validate(true);

                isValid = this.setErrors(validator.errors);

                if (isValid) {
                    this.$set('data.status', 'sending');

                    this.data.success = function (res) {
                        _this.$set('data.status', 'success');
                        
                        if (_this.data.clear === true) {
                            _this.data.body = {};
                        }
                    };
            
                    this.data.error = function (res) {
                        _this.$set('data.status', 'error');
                        _this.setErrors(res.data.errors);
                    };

                    this.submit(this.data);
                }
            },

            setErrors(validationErrors) {
                var i, ii,
                    errors = {},
                    isValid = true;

                validationErrors = validationErrors || [];

                for (i = 0, ii = validationErrors.length; i < ii; i++) {
                    if (!errors[validationErrors[i].field]) {
                        errors[validationErrors[i].field] = validationErrors[i].message;
                    }

                    isValid = false;
                }

                this.$set('data.errors', errors);

                return isValid;
            }
        }
    }
</script>