<template>
    <div>
        <ul class="stuct">
            <li v-for="(item, key) in paths" :title="title" :class="{'clicked': choiced}">
                <div class="link__wrapper">
                    <v-icon color="#fff47f" size="14px">{{ endedElem ? "mdi-folder-cog" : "mdi-folder" }}</v-icon>
                    <router-link :to="{path: generateLink(endedElem ? item : key)}">
                        {{ endedElem ? item : key }}
                    </router-link>
                </div>
                <StructureItem v-if="!endedElem" :title="key" :paths="item" :parent="key" @choosed="choiceUp" />
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "StructureItem",
    props: ["paths", "title", "parent"],
    data() {
        return {
            choiced: false,
        };
    },
    computed: {
        endedElem() {
            return Array.isArray(this.paths);
        },
    },
    methods: {
        generateLink(val) {
            return this.endedElem ? `/admin/translations/${this.$route.params.trGroup}/${this.parent}/${val}/` : `/admin/translations/${this.$route.params.trGroup}/${val}/`;
        },
        handleElemClick(item, key) {
            this.choiced = true;
            this.$emit("choosed", this.endedElem ? [item, this.parent] : [key]);
        },
        choiceUp(val) {
            this.$emit("choosed", val);
        },
    },
};
</script>

<style lang="scss" scoped>
.clicked {
    background: rebeccapurple;
}

.link__wrapper {
    display: flex;
}

.stuct {
    list-style: none;
    padding-left: 10px;
    flex-wrap: wrap;

    li {
        list-style: none;
        padding: 4px 0px 4px 0px;

        a {
            display: flex;
            margin-left: 5px;
            width: 100%;
            color: #777;
            text-decoration: none;
            transition: .2s;

            &.active {
                & ~ {
                    background: #2e2e2e;
                }
                color: #fff;
            }
        }
    }
}
</style>
