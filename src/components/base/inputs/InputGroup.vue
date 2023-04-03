<template>
    <div class="input__group">
        <label class="group__label" :for="groupName">{{ groupLabel }}</label>
        <input class="group__input" :id="groupName" :type="inputType">
    </div>
</template>

<script>
export default {
    name: "InputGroup.vue",
    props: ['groupName', 'inputType', 'groupLabel']
}
</script>

<style scoped lang="scss">
.group__label {
    box-sizing: border-box;
    display: block;
    font-size: 12px;
    color: var(--color-white-50)
}
.input__group {
    box-sizing: border-box;
    width: 100%;
    border-bottom: 1px solid #000;
}
.group__input {
    box-sizing: border-box;
    width: 100%;
    background: none;
    border: none;
    outline: none;
    font-size: 15px;
    color: #fff;
    font-weight: 400;
    padding: 10px 0;
}
</style>
