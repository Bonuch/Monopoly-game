<template>
    <div class="message">
        <p>Сообщение</p>
        {{ data }}
    </div>
</template>

<script>
export default {
    name: "Message",
    props: ['data']
}
</script>

<style scoped>

</style>
