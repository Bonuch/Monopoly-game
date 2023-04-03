/******/
(function (modules) { // webpackBootstrap
  /******/ // The module cache
  /******/
  var installedModules = {};
  /******/
  /******/ // The require function
  /******/
  function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/
    if (installedModules[moduleId]) {
      /******/
      return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/
    var module = installedModules[moduleId] = {
      /******/
      i: moduleId,
      /******/
      l: false,
      /******/
      exports: {}
      /******/
    };
    /******/
    /******/ // Execute the module function
    /******/
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Flag the module as loaded
    /******/
    module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/
    return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/
  __webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/
  __webpack_require__.c = installedModules;
  /******/
  /******/ // define getter function for harmony exports
  /******/
  __webpack_require__.d = function (exports, name, getter) {
    /******/
    if (!__webpack_require__.o(exports, name)) {
      /******/
      Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      });
      /******/
    }
    /******/
  };
  /******/
  /******/ // define __esModule on exports
  /******/
  __webpack_require__.r = function (exports) {
    /******/
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/
      Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module'
      });
      /******/
    }
    /******/
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    /******/
  };
  /******/
  /******/ // create a fake namespace object
  /******/ // mode & 1: value is a module id, require it
  /******/ // mode & 2: merge all properties of value into the ns
  /******/ // mode & 4: return value when already ns object
  /******/ // mode & 8|1: behave like require
  /******/
  __webpack_require__.t = function (value, mode) {
    /******/
    if (mode & 1) value = __webpack_require__(value);
    /******/
    if (mode & 8) return value;
    /******/
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    /******/
    var ns = Object.create(null);
    /******/
    __webpack_require__.r(ns);
    /******/
    Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value
    });
    /******/
    if (mode & 2 && typeof value != 'string')
      for (var key in value) __webpack_require__.d(ns, key, function (key) {
        return value[key];
      }.bind(null, key));
    /******/
    return ns;
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/
  __webpack_require__.n = function (module) {
    /******/
    var getter = module && module.__esModule ?
      /******/
      function getDefault() {
        return module['default'];
      } :
      /******/
      function getModuleExports() {
        return module;
      };
    /******/
    __webpack_require__.d(getter, 'a', getter);
    /******/
    return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/
  __webpack_require__.p = "";
  /******/
  /******/
  /******/ // Load entry module and return exports
  /******/
  return __webpack_require__(__webpack_require__.s = 0);
  /******/
})
/************************************************************************/
/******/
([
  /* 0 */
  /***/
  (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */
    var _module_watchgames_openrules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
    /* harmony import */
    var _module_creategame_btns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
    /* harmony import */
    var _module_cubesblock_btns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
    /* harmony import */
    var _module_patentsblock__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
    /* harmony import */
    var _module_media__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);





    Object(_module_watchgames_openrules__WEBPACK_IMPORTED_MODULE_0__["default"])();
    Object(_module_creategame_btns__WEBPACK_IMPORTED_MODULE_1__["default"])();
    Object(_module_cubesblock_btns__WEBPACK_IMPORTED_MODULE_2__["default"])();
    Object(_module_patentsblock__WEBPACK_IMPORTED_MODULE_3__["default"])();
    Object(_module_media__WEBPACK_IMPORTED_MODULE_4__["default"])();

    /***/
  }),
  /* 1 */
  /***/
  (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */
    __webpack_exports__["default"] = (function () {
      if (document.querySelector('.watchgames')) {
        init();
      }
    });

    function init() {
      var openBtns = document.querySelectorAll('.watchgames__head');
      openBtns.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
          var this_ = event.target.tagName == 'BUTTON' ? event.target : event.target.parentNode;
          var rulesBlock = this_.parentNode.querySelector('.watchgames__rules');

          if (!this_.parentNode.classList.contains('watchgames__item--private')) {
            if (this_.classList.contains('active')) {
              this_.classList.remove('active');
              rulesBlock.classList.remove('active');
            } else {
              this_.classList.add('active');
              rulesBlock.classList.add('active');
            }
          }
        });
      });
    }

    /***/
  }),
  /* 2 */
  /***/
  (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */
    __webpack_exports__["default"] = (function () {
      if (document.querySelector('.creategame')) {
        init();
      }
    });

    function init() {
      var creategameBtns = document.querySelectorAll('.creategame__rules-btn');
      creategameBtns.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
          var this_ = event.target.tagName == 'BUTTON' ? event.target : event.target.parentNode;

          if (this_.classList.contains('active')) {
            this_.classList.remove('active');
          } else {
            this_.classList.add('active');
          }
        });
      });
    }

    /***/
  }),
  /* 3 */
  /***/
  (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */
    __webpack_exports__["default"] = (function () {
      if (document.querySelector('.cubesblock')) {
        init();
      }
    });

    function init() {
      var cubesblockBtns = document.querySelectorAll('.cubesblock__btn');
      cubesblockBtns.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
          var this_ = event.target.tagName == 'BUTTON' ? event.target : event.target.parentNode;

          if (this_.classList.contains('active')) {
            this_.classList.remove('active');
            this_.textContent = 'Применить';
          } else {
            this_.classList.add('active');
            this_.textContent = 'Применены';
          }
        });
      });
    }

    /***/
  }),
  /* 4 */
  /***/
  (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */
    __webpack_exports__["default"] = (function () {
      if (document.querySelector('.patentsblock')) {
        init();
      }
    });

    function init() {
      initPatentFieldBtns();
    }

    function initPatentFieldBtns() {
      var patentFieldBlock = document.querySelector('.patentsblock__choise--space');
      var patentFieldBtns = patentFieldBlock.querySelectorAll('.patentsblock__btn');

      for (var index = 0; index < patentFieldBtns.length; index++) {
        var btn = patentFieldBtns[index];
        btn.addEventListener('click', function (event) {
          var this_ = event.target.tagName == 'BUTTON' ? event.target : event.target.parentNode.tagName == 'BUTTON' ? event.target.parentNode : event.target.parentNode.parentNode;
          patentFieldBtnAction(this_, patentFieldBtns);
        });
      }
    }

    function patentFieldBtnAction(btn, btns) {
      var btnInfo = {
        icon: btn.querySelector('img').src,
        colorcode: btn.querySelector('.patentsblock__colorcode').style.backgroundColor,
        price: parseInt(btn.querySelector('.patentsblock__price-text').textContent)
      };
      var patentsBlock = document.querySelector('.patentsblock__choise--patents');

      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        patentsBlock.classList.remove('active');
      } else {
        btn.classList.add('active');

        for (var index = 0; index < btns.length; index++) {
          var element = btns[index];

          if (element != btn) {
            element.classList.remove('active');
          }
        }

        buildList(btnInfo, patentsBlock);
        patentsBlock.classList.add('active');
      }
    }

    function buildList(btnInfo, patentsBlock) {
      var patentsList = patentsBlock.querySelector('.patentsblock__list');
      patentsList.innerHTML = '';

      for (var index = 0; index < 5; index++) {
        var item = document.createElement('li');
        item.classList = 'patentsblock__item';
        var patentBtn = document.createElement('button');
        patentBtn.classList.add('patentsblock__btn');

        if (index >= 2) {
          patentBtn.classList.add('hold');
        } else {
          changePatentBtnState(patentBtn);
        }

        item.appendChild(patentBtn);
        var priceBlock = document.createElement('div');
        priceBlock.classList = 'patentsblock__price';

        switch (index) {
          case 1:
            priceBlock.style.backgroundColor = '#cd9864';
            break;

          case 2:
            priceBlock.style.backgroundColor = '#d5d5d5';
            break;

          case 3:
            priceBlock.style.backgroundColor = '#fed700';
            break;

          case 4:
            priceBlock.style.backgroundColor = '#40daff';
            break;
        }

        var price = document.createElement('span');
        price.classList = 'patentsblock__price-text';

        if (index === 0) {
          price.textContent = "".concat(btnInfo.price, "B");
        } else {
          var modificator = (index + 1) / 10;
          var newprice = Math.ceil(btnInfo.price + btnInfo.price * modificator);
          price.textContent = "".concat(newprice, "B");
        }

        priceBlock.appendChild(price);
        patentBtn.appendChild(priceBlock);
        var icon = document.createElement('img');
        icon.classList = 'patentsblock__icon';
        icon.src = btnInfo.icon;
        icon.alt = 'icon';
        patentBtn.appendChild(icon);
        var colorcode = document.createElement('div');
        colorcode.classList = 'patentsblock__colorcode';
        colorcode.style.backgroundColor = btnInfo.colorcode;
        patentBtn.appendChild(colorcode);
        patentsList.appendChild(item);
      }
    }

    function changePatentBtnState(btn) {
      btn.addEventListener('click', function (event) {
        var this_ = event.target.tagName == 'BUTTON' ? event.target : event.target.parentNode.tagName == 'BUTTON' ? event.target.parentNode : event.target.parentNode.parentNode;

        if (this_.classList.contains('active')) {
          this_.classList.remove('active');
        } else {
          this_.classList.add('active');
        }
      });
    }

    /***/
  }),
  /* 5 */
  /***/
  (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */
    __webpack_exports__["default"] = (function () {
      init();
    });

    function init() {
      sideblock();
      chat();
      headerMenu();
    }

    function sideblock() {
      var openBtn = document.querySelector('.profileblock__openbtn');
      var closeBtn = document.querySelector('.profileblock__closebtn');
      var sideblock = document.querySelector('.sideprofile');
      if (openBtn) {
        openBtn.addEventListener('click', function (event) {
          var this_ = event.target.tagName == 'BUTTON' ? event.target : event.target.parentNode.tagName == 'BUTTON' ? event.target.parentNode : event.target.parentNode.parentNode;
          openSideBlock(this_, sideblock);
        });
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', function (event) {
          closeSideBlock(openBtn, sideblock);
        });
      }
    }

    function chat() {
      var openBtn = document.querySelector('.chat__openbtn');
      var chat = document.querySelector('.chat');
      if (openBtn) {
        openBtn.addEventListener('click', function (event) {
          var this_ = event.target.tagName == 'BUTTON' ? event.target : event.target.parentNode.tagName == 'BUTTON' ? event.target.parentNode : event.target.parentNode.parentNode;

          if (this_.classList.contains('active')) {
            this_.classList.remove('active');
            chat.classList.remove('active');
          } else {
            this_.classList.add('active');
            chat.classList.add('active');
          }
        });
      }
    }

    function headerMenu() {
      var openBtn = document.querySelector('.menu__openbtn');
      var menu = document.querySelector('.menu__list--mobile');
      if (openBtn) {
        openBtn.addEventListener('click', function (event) {
          var this_ = event.target.tagName == 'BUTTON' ? event.target : event.target.parentNode.tagName == 'BUTTON' ? event.target.parentNode : event.target.parentNode.parentNode;

          if (this_.classList.contains('active')) {
            this_.classList.remove('active');
            menu.classList.remove('active');
          } else {
            this_.classList.add('active');
            menu.classList.add('active');
          }
        });
      }
    }

    function openSideBlock(btn, sideblock) {
      btn.classList.add('active');
      sideblock.classList.add('active');
    }

    function closeSideBlock(btn, sideblock) {
      btn.classList.remove('active');
      sideblock.classList.remove('active');
    }

    /***/
  })
  /******/
]);