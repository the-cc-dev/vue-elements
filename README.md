# Vue Elements

Some common component Elements for vue apps. The design is meant to be design free meaning you can use it with bootstrap or material or custom or whatever.

This is an initial upload so documentation will come later once the package is a bit more stable or official. For now some of the elements are listed below.



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




## Form




## Upload