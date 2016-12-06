# Vue Elements

Some common component Elements for vue apps. The design is meant to be design free meaning you can use it with bootstrap or material or custom or whatever.



## Modal

Facilitates modal functionality in the app. It will take care of backdrop and centering, alignment, scrollbars, etc. It also has a global store so that the modals can be accessed from anywhere and fed data in.

The design of the modal is completely up to the developers. There is no boot-strapped code other than the alignment divs.

* The component can be included anywhere.
* Is accessible through a nice api `$modal.show('some-modal')`.
* Can receive data from anywhere.


```
<w-modal
    name="products-delete"
    :on-show="myShowFunction"
    :on-hide="myHideFunction"
>
    Modal content goes here...
</w-modal>

```

Once the name of the modal is set it can be accessed anywhere. You can also pass in the data directly which will be available in the `onShow` method.

```
this.$modal.show('product-delete', {product: item});

this.$modal.hide('product-delete');
```

A fuller example might look like so:

```
<template>
    <w-modal name="product-delete" :on-show="onShow">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button v-on:click="$modal.hide('product-delete')" type="button" class="close"><span>&times;</span></button>
                </div>

                <div class="modal-body">
                    Are you sure you want to delete product <strong>"{{ product.name }}"</strong>?
                </div>

                <div class="modal-footer">
                    <button v-on:click="$modal.hide('product-delete')" type="button" class="btn btn-default">Cancel</button>
                    
                    <button v-on:click="delete()" type="button" class="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>
    </w-modal>
</template>

<script>
    export default {
        data() {
            return {
                product: null,
            };
        },

        methods: {
            onShow(name, data) {
                this.product = data.product;
            },

            delete() {
                // delete some stuff
            }
        }
    }
</script>
```



## MsgBag

The msg bag is a simple component for dealing with globalized messages. Specifically ones that might appear in the corner of the browser window for a few seconds and nicely fade out.

Again there is no design provided and it's up to the developer to provide the design for the alert. The plugin simply facilitates the display of the messages with a nice api.

The local applications alert component might look something like below. Note that this just defines the single alert box used in the plugin:

```
<template>
    <div v-bind:class="['alert', 'alert-' + _type]" transition="slide-up">
        <div class="msg">{{ msg }}</div>
    </div>
</template>

<script>
    export default {
        props: ['type', 'msg'],

        computed: {
            _type() {
                if (this.type === 'error') { return 'danger'; }
                if (this.type === 'success') { return 'info'; }

                return this.type;
            }
        }
    }
</script>

<style>
    #msgbag-global {
        position: fixed;
        right: 20px;
        bottom: 20px;
    }
</style>
```

Then add the msg box element:

```
<template>   
    <div>
        <w-msgbag
            name="global"
            component="el-alert"
            :max="5"
            :timeout="2000"
        >
        </w-msgbag>
    </div>
</template>

<script>
    export default {
        ready() {
            Vue.component('el-alert', require('./Alert.vue'));
        },
    }
</script>
```

In the examples above note how the alert element receives the `type` and `msg` prop values. From there design the alerts as you like.

You can also create more than ons "message bag". The default name is `global` and you can add more by setting a name.

From there you can send out alert messages from anywhere in the app.

```
this.$msgbag.success('Yay, success!'); // Default "global" msg bag.
this.$msgbag.error('some-bag', 'Oh, error!') // A named bag.
this.$msgbag.warning('another-bag', 'Oh, error!') // A warning type.

```

These are the most common messages so they have shortcuts. To send a custom type use the `show` method directly.

```
this.$msgbag.show('notice', 'Some notice msg'); // Default "global" bag.
this.$msgbag.show('more-bags', 'danger', 'This is not good!'); // Full set of options for named bag and custom msg type.
```



## Form

The form is based on the current validator for Vue 1. Since 2.0 version is not out yet. It's based on the idea that again the validator should work without having to define any components.

It also doesn't try to create some schema or create any fancy logic. It simply validates and sends back some errors which the developer is free to work with.


```
<template>
    <div class="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
        <validator name="validator">
            <el-form :submit="login" :data.sync="loginData">
                <div class="form-group">
                    <input v-model="loginData.body.email" type="text" placeholder="Email" class="form-control" v-validate:email="{required: true}" />
                    <div class="text-danger">{{ loginData.errors.email }}</div>
                </div>
                
                <div class="form-group">
                    <input v-model="loginData.body.password" type="password" placeholder="Password" class="form-control" v-validate:password="{required: true}" />
                    <div class="text-danger">{{ loginData.errors.password }}</div>
                </div>
                
                <button type="submit" class="btn btn-primary" :disabled="loginData.status === 'sending'">
                    Login
                </button>
            </el-form>
        </validator>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loginData: {
                    body: {},
                    errors: {},
                    status: null
                }
            };
        },

        methods: {
            login() {
                this.$http.post('auth/login', this.loginData.body).then(function (res) {
                    // success
                }, function (res) {
                    this.loginData.errors = res.data.errors;
                });
            }
        }
    };
</script>
```

Note that the submit function will not fire if the form is invalid. We can also gracefully handle errors from the back end by simply setting the errors object.

This way your app is free to customize and handle the errors anyway it likes.



## Upload

The upload component handles uploads and again is removed from any design elements. It only facilitates the uploading and leaves design the developer.

It handles both file input upload, and a dropzone style upload, also single and multiple modes.

Single file button upload:

```
<template>
    <el-upload :request="requestData"></el-upload>

    <button v-on:click="requestData.openDialog()" class="btn btn-primary" :disabled="requestData.files[0].status === 'sending'">Update Photo</button>

    <div v-show="requestData.files[0].errors" class="text-danger">
        {{ requestData.files[0].errors[0].message }}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                requestData: {
                    url: 'users/1/avatar',
                    success(res) {
                        // yay.
                    },
                    error(res, file) {
                        if (res) {
                            file.errors = res.data.errors || [{message: res.data.msg}];
                        }
                    },
                    complete(res) {

                    }
                }
            };
        }
    }
</script>
```

It's important to note that the `success` and `error` will fire after every file is sent (when using multiple mode).

BUT the `complete` function will only fire once after everything is complete (all files).

An example with multiple file upload and dropzone.

```
<template>
    <div>
        <el-upload
            dropzone="product-medias-dropzone"
            :multiple="true"
            :request.sync="requestData"
        ></el-upload>

        <div>
            <button v-on:click="requestData.openDialog()" class="btn btn-primary" :disabled="requestData.status === 'sending'">
                Select Photos
            </button>

            <button v-on:click="requestData.reset()" class="btn btn-default" :disabled="requestData.status === 'sending' || ! (requestData.files || []).length">
                Reset
            </button>
        </div>

        <div>
            <div class="progress">
                <div class="progress-bar" style="width: {{ requestData.meta.percentComplete }}%;">
                    <span class="sr-only">{{ requestData.meta.percentComplete }}% Complete</span>
                </div>
            </div>

            <div v-show="requestData.errors[0]" class="text-danger">
                {{ requestData.errors[0].message }} &nbsp;
            </div>
        </div>

        <div v-show="requestData.files.length">
            <div v-for="file in requestData.files"  v-bind:class="[file.errors.length ? 'text-danger' : 'text-success']">
                <span>{{ file.name }}</span>
                <span class="pull-right">{{ file.errors[0].message }}</span>
            </div>
        </div>

        <div>
            <strong>Select file or drag and drop below.</strong>
        </div>

        <div id="product-medias-dropzone" sytle="min-height:200px;">
            <div class="row">
                <div v-for="image in product.gallery">
                    <img :src="image.url" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['product'],

        data() {
            return {
                requestData: {
                    url: 'products/' this.product.id + '/gallery',
                    success(res) {
                        _this.product.gallery.push(res.data.data);
                    },
                    error(res, file) {
                        if (res) {
                            file.errors = res.data.errors || [{message: res.data.msg}];
                        }
                    },
                    complete() {
                        this.$msgbag.success('File upload complete.');
                    }
                }
            };
        }
    }
</script>
```

For full list of options supported just check the `upload/Upload.vue` file.