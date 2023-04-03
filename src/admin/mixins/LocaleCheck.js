import locales from '../../locales/en/knowledge.json'

export default {
  data() {
    return {
      locales: locales,
    }
  },
  methods: {
    isNotTranslated(section, texts) {
      if (!this.locales) return true
      const locales = this.locales[section]

      for (let i = 0; i < texts.length; i++) {
        if (!locales[texts[i]]) {
          if (!!texts[i]) {
            return true
          }
        }
      }
      return false
    }
  },
}
