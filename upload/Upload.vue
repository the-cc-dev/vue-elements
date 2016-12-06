<template>
    <div style="display:none;">
        <input v-model="filesInputWatcher" id="import-csv-file-{{ id }}" type="file" v-bind:multiple="_multiple" />
    </div>
</template>

<script>
    export default {
        props: [
            'request',
                // url
                // body
                // error
                // success
                // complete
                // status
                // files
                // errors (global).
                // openDialog
                // onSelect
                // start
                // reset
                // meta
                    // errorCount
                    // successCount
                    // completeCount
                    // totalFiles
                    // percentComplete

            'name',           // The file input name that the formData will use.
            'multiple',       // Allow multiple file select.
            'dropzone',       // Element id for dropzone.
            'async',          // Fire off all files at once.

            'uploadOnSelect', // Whether to trigger the upload right after selecting or not (can trigger "start" otherwise).
            'extensions',     // (validation) Allowed extensions.
            'maxFiles',       // (validation) Max number of files if multiple is selected.
            'maxSizePerFile',        // (validation) Max size per file.
        ],

        data() {
            return {
                id: Math.random(),
                filesWatcher: null, 
                filesInputWatcher: null // Need this so that same file can be re-selected.
            };
        },

        ready () {
            this.init();

            this.initDropzone();

            this.reset();
        },

        computed: {
            _name() {
                return this.name || 'file';
            },

            _async() {
                return this.async === true ? true : false;
            },

            _multiple() {
                return this.multiple === true ? true : false;
            },

            _maxFiles() {
                return this.maxFiles || 4;
            },

            _maxSizePerFile() {
                return this.maxSizePerFile || 1024;
            },

            _extensions() {
                return this.extensions || ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg'];
            },

            _uploadOnSelect() {
                return this.uploadOnSelect === false ? false : true;
            }
        },

        watch: {
            filesInputWatcher(newVal) {
                this.filesWatcher = document.getElementById('import-csv-file-' + this.id).files;
            },

            filesWatcher(newVal) {
                if (newVal) {
                    if (this._uploadOnSelect) {
                        this.reset();
                        this.submit();
                    }

                    if (this.request.onSelect) {
                        this.validate();
                        this.request.onSelect(this.request);
                    }
                }
            }
        },

        methods: {
            init() {
                this.$set('request.status', null);
                this.$set('request.files', null);
                this.$set('request.errors', null);
                this.$set('request.meta', null);
                this.$set('request.openDialog', this.triggerFileSelect);
                this.$set('request.start', this.submit);
                this.$set('request.reset', this.reset);
            },

            initDropzone() {
                var _this = this,
                    dz = document.getElementById(this.dropzone);

                // TODO: Can also check for dropzone browser support here.
                if ( ! dz) {
                    return;
                }

                dz.addEventListener('dragover', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
                }, false);

                dz.addEventListener('drop', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    _this.filesWatcher = e.dataTransfer.files;
                }, false);
            },

            reset() {
                this.request.files = [];
                this.request.errors = [];
                this.request.status = null;
                this.request.meta = {
                    errorCount: 0,
                    successCount: 0,
                    completeCount: 0,
                    totalFiles: 0,
                    percentComplete: 0
                };

                this.filesInputWatcher = null;
            },

            triggerFileSelect() {
                document.getElementById('import-csv-file-' + this.id).click();
            },

            setComplete() {
                this.request.status = 'complete';

                if (this.request.complete) {
                    this.request.complete.call(this);
                }

                this.reset();
            },

            filePreProcess(file) {
                var fileUploadFormData;

                if (file.errors.length) {
                    this.filePostProcess(file);
                    return;
                }

                fileUploadFormData = new FormData();
                
                fileUploadFormData.append(this._name, file.$file);

                file.status = 'sending';

                // TODO: append request.body data here (with loop).

                this.$http.post(this.request.url, fileUploadFormData).then((res) => {
                    file.status = 'success';
                    
                    this.filePostProcess(file);
                        
                    if (this.request.success) { this.request.success.call(this, res, file); }
                }, (res) => {
                    file.status = 'error';

                    this.filePostProcess(file);

                    if (this.request.error) { this.request.error.call(this, res, file); }
                });
            },

            filePostProcess(file) {
                this.request.meta[file.status + 'Count']++;

                this.request.meta.completeCount++;

                this.request.meta.percentComplete = this.request.meta.completeCount / this.request.meta.totalFiles * 100;
                
                if ( ! this._async && this.request.files[file.index + 1]) {
                    this.filePreProcess(this.request.files[file.index + 1]);
                }

                if (this.request.meta.completeCount >= this.request.meta.totalFiles) {
                    this.setComplete();
                }
            },

            validate() {
                var i, ii, file,
                    _this = this,
                    error = false;

                this.request.meta.totalFiles = this.filesWatcher.length;

                // Check for max files selected
                if (this.filesWatcher.length > this._maxFiles) {
                    this.request.errors.push({
                        rule: 'maxfiles',
                        message: 'Maximum of ' + this._maxFiles + ' files exceeded.'
                    });

                    return;
                }

                for (i = 0, ii = this.filesWatcher.length; i < ii; i++) {
                    
                    // Manual copy here to decouple.
                    file = {
                        errors: [],
                        index: i,
                        status: null,
                        name: this.filesWatcher[i].name,
                        size: this.filesWatcher[i].size,
                        $file: this.filesWatcher[i],
                    };

                    file.preview = (function (file) { return function (cb) { _this.preview(file, cb); }; })(file);

                    // Check extensions.
                    if (this._extensions.indexOf(file.name.split('.')[1]) < 0) {
                        file.errors.push({
                            rule: 'extension',
                            message: 'File has an invalid extension.'
                        });

                        error = true;
                    }

                    // Check max size.
                    if ( (file.size / 1024) > this._maxSizePerFile) {
                        file.errors.push({
                            rule: 'size',
                            message: 'File is over the ' + this._maxSizePerFile + 'kb limit.'
                        });

                        error = true;
                    }
                
                    this.request.files.$set(i, file);

                    // Send error.
                    if (this.request.files[i].errors.length) {
                        this.request.files[i].status = 'error';

                        if (this.request.error) { this.request.error.call(this, null, this.request.files[i]); }
                    }
                }

                if (error) {
                    this.request.errors.push({
                        rule: 'fileError',
                        message: 'Some of the files could not be uploaded due to errors.'
                    });
                }

                return !error;
            },

            preview(file, cb) {
                var reader  = new FileReader();

                reader.addEventListener('load', function () {
                    file.raw = reader.result;

                    if (cb) { cb(file); }
                }, false);

                if (file.$file) {
                    reader.readAsDataURL(file.$file);
                }
            },

            submit() {
                var i, ii;

                if ( ! this.validate()) {
                    return;
                }

                this.request.status = 'sending';

                if (this._async) {
                    for (i = 0, ii = this.request.files.length; i < ii; i++) {
                        this.filePreProcess(this.request.files[i]);
                    }
                }
                else {
                    this.filePreProcess(this.request.files[0]);
                }
            }
        }
    };
</script>