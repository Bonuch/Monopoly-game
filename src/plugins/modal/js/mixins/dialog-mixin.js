export default {
	props: {
		options: {
			type: Object,
			required: true
		},
		colorSchema: String
	},
	computed: {
		message(){
			return this.options.message
		},
		okBtnText()
		{
			return this.options.okText
		},
		acceptBtnText() {
			return this.options.acceptText
		},
		cancelBtnText() {
			return this.options.cancelText
		}
	},
	methods: {
		cancelModal() {
			this.close()
		},
		acceptModal() {
			this.proceed()
		},
		proceed() {
			this.options.promiseResolver()
			this.close()
		},
		close() {
			this.$emit('close')
		}
	}
}
