<template>
    <div class="сommon-сhat">
        <h3 class="chat-header">Общий чат</h3>
        <Message />
    </div>
</template>

<script>
import Message from "./components/Message";

export default {
name: "CommonChat",
    components: {Message}
}
</script>

<style scoped lang="scss">

.сommon-сhat {
    color: #fff;
    height: 100%;
}

.chat-header {
    color: #fff;
    margin-top: 0;
}

</style>
