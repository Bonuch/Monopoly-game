<template>
    <div class="form-control__errors form-control__errors--rect" :class="selectors">
        <svg class="form-control__errors-icon" width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.886 477.886">
            <path
                d="M476.086,452.802L254.22,9.068c-5.03-8.436-15.946-11.197-24.382-6.168c-2.536,1.512-4.656,3.632-6.168,6.168    L1.804,452.802c-4.213,8.432-0.794,18.682,7.638,22.896c2.371,1.185,4.986,1.801,7.637,1.8h443.733    c9.426,0.004,17.07-7.633,17.075-17.059C477.888,457.788,477.271,455.173,476.086,452.802z M44.692,443.364L238.945,54.858    l194.253,388.506H44.692z"/>
            <path
                d="M238.945,170.297c-9.426,0-17.067,7.641-17.067,17.067v119.467c0,9.426,7.641,17.067,17.067,17.067    s17.067-7.641,17.067-17.067V187.364C256.012,177.938,248.371,170.297,238.945,170.297z"/>
            <path
                d="M238.945,358.031c-9.426,0-17.067,7.641-17.067,17.067v17.067c0,9.426,7.641,17.067,17.067,17.067    s17.067-7.641,17.067-17.067v-17.067C256.012,365.672,248.371,358.031,238.945,358.031z"/>
        </svg>

        <h4 class="form-control__errors-text m-0">{{ message }}</h4>
    </div>
</template>

<script>
    export default {
        name: 'FormError',
        props: {
            message: {
                type: String,
                required: true,
            },
            selectors: {
                type: String,
            },
        }
    }
</script>

<style lang="scss" scoped>
    .form-control__errors {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        font-size: 12px;

        &--rect {
            padding: 12px 6px;
            background-color: var(--color-danger);

            .form-control__errors-icon {
                color: #fff;
            }
        }

        &-icon {
            margin-right: 0.5rem;
            fill: currentColor;
            color: var(--color-danger);
        }

        &-text {
            margin: 0;
            color: var(--color-gray-200);
        }
    }
</style>
