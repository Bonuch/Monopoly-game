<template>
    <div class="translate__wrapper">
        <div class="translate__values">
            <template v-if="dataValues && dataValues.meta" class="t_header">
                <div class="t_header">
                    <h2 v-if="dataValues.meta.title">{{ dataValues.meta.title }}</h2>
                    <p v-if="dataValues.meta.description">{{ dataValues.meta.description }}</p>
                </div>
            </template>
            <hr />
            <TranslateElements :show-description="showDescription" v-if="dataValues" :elements="dataValues.data"
                               @valueChanged="saveTemporaryValues" @saveNewKey="saveNewKey" />
        </div>
        <div class="translate__toolbar" :class="{'unactive': Object.keys(savedValues).length === 0}">
            <v-alert v-if="success" class="alert" type="success">
                Данные сохранены.
            </v-alert>
            <span style="float: left" v-if="error">{{ error }}</span>
            <button :disabled="Object.keys(savedValues).length === 0" @click="saveChanges">сохранить</button>
        </div>
    </div>
</template>

<script>
import TranslateElements from "./Editor/TranslateElements";

export default {
    name: "TranslatorValues",
    components: { TranslateElements },
    data() {
        return {
            dataValues: null,
            savedValues: {},
            error: null,
            success: false,
        };
    },
    computed: {
        showDescription() {
            return ["shop", "loot"].includes(this.$route.params.trGroup);
        },
        getParams() {
            const [type, lang] = this.$route.params.pathMatch.split("/").filter(item => item !== "");
            return {
                group: this.$route.params.trGroup,
                language: lang,
                type: type,
            };
        },
        error() {

        },
    },
    methods: {
        async load(uri) {
            console.log(uri);
            this.$store.$app.$socket.client.emit("get_translate_values", {
                uri: uri,
            }, (response) => {
                console.log();
                this.dataValues = response;
            });
            return "";
        },
        successAlert() {
            this.success = true,
                setTimeout(() => {
                    this.success = false;
                }, 3000);
        },
        async saveNewKey({ new_key, cb }) {
            const payload = {
                new_key: new_key,
                group: this.getParams.group,
                type: this.getParams.type,
            };
            console.log(payload);
            await this.$store.$app.$socket.client.emit("save_new_key", payload, async response => {
                console.log(response);
                if (response && !response.error) {
                    await this.fetchData();
                    cb();
                }
            });
        },
        saveTemporaryValues(vals) {
            console.log(vals);
            this.$set(this.savedValues, vals.translate_key, vals.translate_val);
            this.savedValues[vals.translate_key] = {
                title: vals.translate_val,
                description: vals.description
            };
            this.$emit("saveTempVal", vals);
        },
        saveChanges() {
            this.$store.$app.$socket.client.emit("save_translate_values", {
                changedObject: this.savedValues,
                ...this.getParams,
            }, (response) => {
                if (response.error || response.errorKeys.length > 0) {
                    this.error = response.error || response.errorKeys.length > 0;
                    return;
                }
                this.savedValues = {};
                this.successAlert();
            });
        },
        async fetchData() {
            const currentUri = `${this.$route.params.trGroup}/${this.$route.params.pathMatch}`;
            await this.load(currentUri);
        },
    },
    async created() {
        await this.fetchData();
    },
    destroyed() {
        console.log("DESTROYED");
    },

    async beforeRouteUpdate(to, from, next) {
        next();
        // console.log(to.params.trGroup, to.params.pathMatch);
        // console.log("FROM ----", from);
        // console.log("TO ----", to);
        this.savedValues = {};
        this.dataValues = null;
        await this.load(`${to.params.trGroup}/${to.params.pathMatch}`);
    },
};
</script>

<style scoped lang="scss">
.translate__values {
    width: 100%;
    //height: 92%;
    display: flex;
    flex-direction: column;
    //flex: 1;
    //height: 100%;
    //padding-left: 15px;
    //margin-left: 15px;
    border: 1px solid #121212;
    box-shadow: 0px 0px 20px rgba(#000, .5);
    background: lighten(#121212, 2);
    overflow-x: auto;
    scrollbar-color: #6969dd #e0e0e0;
    scrollbar-width: thin;
}

.translate__wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
}

.unactive {
    height: 54px;
    //background: #2e2e2e;
}

.translate__toolbar {
    position: relative;
    margin-top: 15px;
    text-align: right;
    background: #1e1e1e;
    padding: 10px;

    button {
        background: #4A2996;
        padding: 5px 10px;
        font-weight: bold;

        &:disabled {
            color: #9f9f9f;
            background: #6f6f6f;
        }
    }
}

.t_header {
    padding: 15px;
}

hr {
    //width: 90%;
    //margin: auto;
    border-color: #2e2e2e;
}

.alert {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
}
</style>
