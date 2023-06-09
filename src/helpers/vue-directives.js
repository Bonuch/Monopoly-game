import Vue from 'vue';

Vue.directive('scroll', {
    inserted: function (el, binding) {
        let f = function (evt) {
            if (binding.value(evt, el)) {
                window.removeEventListener('scroll', f)
            }
        };
        window.addEventListener('scroll', f)
    }
});

Vue.directive('resize', {
    inserted: function (el, binding) {
        let f = function (evt) {
            if (binding.value(evt, el)) {
                window.removeEventListener('resize', f)
            }
        };
        window.addEventListener('resize', f)
    }
});