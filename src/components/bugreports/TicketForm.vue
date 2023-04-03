<template>
    <div class="ticket__form">
        <div class="ticket__group">
            <label for="ticketTitle" class="ticket__label">Какая у вас проблема кратко?</label>
            <input id="ticketTitle" type="text" class="ticket__input" placeholder="Например: не работает чат">
        </div>

        <div class="ticket__group">
            <label for="ticketDescription" class="ticket__label">Опишите вашу проблему подробнее</label>
            <textarea id="ticketDescription" type="text" class="ticket__area" placeholder="Например: не работает чат">
            </textarea>
        </div>

        <div class="ticket__group control">
            <a class="ticket__control cancel">отмена</a>
            <a class="ticket__control report">отправить</a>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";


export default {
    name: "TicketForm",

};
</script>

<style scoped lang="scss">
.ticket {
    &__form {
        display: flex;
        flex-direction: column;
        width: 80%;
        padding: 15px;
        border-radius: 6px;
        background: var(--color-background-2);
    }

    &__input {
        background-color: var(--color-background-3);
        border: none;
        outline: none;
        font-size: 16px;
        color: var(--color-white);
        padding: 5px 15px;
        margin-top: 10px;
    }

    &__area {
        margin-top: 15px;
        height: 350px;
        background-color: var(--color-background-3);
        border: none;
        outline: none;
        color: #fff;
        font-size: 14px;
        padding: 5px 15px;
    }

    &__label {
        text-align: left;
    }

    &__group {
        display: flex;
        flex: 1;
        flex-direction: column;
        margin-bottom: 25px;

        &.control {
            margin-top: 15px;
            flex-direction: row;
            justify-content: center;
        }
    }

    &__control {
        display: block;
        padding: 7px 15px;
        cursor: pointer;
        border-radius: 6px;
        width: 120px;

        &.cancel {
            background: var(--color-base-gray);
            color: #fff;
        }

        &.report {
            margin-left: 15px;
            background: var(--color-background-3);
        }
    }
}
</style>
