// !Notice: Не точку (знак препинания) в конце переводимых фраз

import Vue from "vue";
import VueI18n from "vue-i18n";
import axios from "axios";

Vue.use(VueI18n);

function availableLocales() {
    return require.context("./locales", true, /[A-Za-z0-9-_,\s]+\.json$/i);
}

function navigatorLanguage() {
    var client = window.navigator ? (window.navigator.language ||
        window.navigator.systemLanguage || window.navigator.userLanguage) : "-";
    return client.toLowerCase().split("-")[0];
}

function loadLocaleMessages() {
    const locales = availableLocales();
    const messages = {};
    locales.keys().forEach(key => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
            const locale = matched[1];
            messages[locale] = locales(key);
        }
    });
    return messages;
}

VueI18n.prototype.change = function(lang) {

    const locales = availableLocales();
    window.locales = locales;
    if (locales.keys().includes(`./${lang}.json`)) {
        this.locale = lang;
        return;
    }

    const navlang = navigatorLanguage();
    if (locales.keys().includes(`./${navlang}.json`)) {
        this.locale = navlang;
        return;
    }
    this.locale = this.fallbackLocale;
};

// Переводит текст приходящий с сервера, если есть такая возможность
export const i18nServer = {
    install(Vue, options) {
        Vue.prototype.$tt = function(section, message) {
            message = message.trim();
            if (this.$te(section + message)) {
                return this.$t(section + message);
            } else {
                return message;
            }
        };
    },
};


const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {}
})

const loadedLanguages = []

function setI18nLanguage (lang) {
    i18n.locale = lang
    axios.defaults.headers.common['Accept-Language'] = lang
    document.querySelector('html').setAttribute('lang', lang)
    return lang
}

export function loadLanguageAsync (lang) {
    if (loadedLanguages.includes(lang)) {
        if (i18n.locale !== lang) setI18nLanguage(lang)
        return Promise.resolve()
    }
    return axios.get(process.env.VUE_APP_HOST + `/api/translate/${lang}`).then(response => {
        let msgs = response.data[lang]
        loadedLanguages.push(lang)
        // i18n.setLocaleMessage(lang, msgs)
        i18n.setLocaleMessage(lang, {
            ...msgs,
            ...additional_fields[lang]
        });
        setI18nLanguage(lang)
    })
}

const additional_fields = {
    ru: {
        tech_descr: "Для того чтобы сообщить о проблеме или задать вопрос, нажмите на кнопку написать",
        tech_guide1: "Опишите проблему, чем больше информации тем лучше",
        tech_guide2: "Опишите проблему, чем больше информации тем лучше",
        tech_guide3: "Подождите ответа",
        instruction: "Инструкция",
    },
    en: {
        tech_descr: "To report a problem or ask a question, click the submit button.",
        tech_guide1: "Describe the problem, the more information the better",
        tech_guide2: "Attach a screenshot if possible",
        tech_guide3: "Wait for an answer",
        instruction: "Instruction",
    }
}




export default i18n;
