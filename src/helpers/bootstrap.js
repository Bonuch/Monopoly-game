import $ from 'jquery'; // TODO удалить
import axios from '@/helpers/axios-instance'; // init axios

window.$ = $; // TODO удалить

//функция из старого кода, используется в GameBoard.vue
// TODO удалить, есть vuejs @resize
window.$.fn.resized = function (callback, timeout) {
    $(this).resize(function () {
        var $this = $(this);
        if ($this.data('resizeTimeout')) {
            clearTimeout($this.data('resizeTimeout'));
        }
        $this.data('resizeTimeout', setTimeout(callback, timeout));
    });
};
