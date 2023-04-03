<template>
    <div>
        <StructureItem :paths="paths" @choosed="translatePick" />
    </div>
</template>

<script>
import StructureItem from "./StructureItem";

export default {
    name: "Structure",
    props: ["paths"],
    components: { StructureItem },
    methods: {
        translatePick(val) {},
        generateUri(val) {
            let res = ""
            val.forEach((item, idx) => {
                res += "/" + item
            })
            return res
        }
    },
};
</script>

<style scoped lang="scss">
.stuct {
    list-style: none;
    padding-left: 10px;

    li {
        list-style: none;
        padding: 0;

        a {
            margin-left: 5px;
            color: #eee;
            text-decoration: none;
        }
    }
}

.item__description {
    font-size: 11px;
    color: #999;
    margin: 0;
    line-height: 1;
}
</style>
