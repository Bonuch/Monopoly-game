<template>
    <div class="shines">
        <h1>Сияние</h1>
        <div class="block__container">
            <div class="description__block">
                <v-card style="padding: 15px">
                    <h2>Сияние во время игры</h2>
                    <p>Сияние в игре начисляется по следующей формуле: сияние<sub>цвет</sub> = базовое значение в час *
                        коэфицент</p>
                    <p>Базовое значение копится в течении часа, если базовое значение 10 то через час игрок получит 10
                        сияний</p>
                    <div>
                        Каждая стороная игровой доски генерирует сияния определенного цвета:
                        <ul>
                            <li>верхняя сторона создает зеленое сияние</li>
                            <li>правая сторона создает желтое сияние</li>
                            <li>нижняя сторона создает розовое сияние</li>
                            <li>левая сторона создает синее сияние</li>
                            <li>красные и розовые монополии создают красное сияние</li>
                        </ul>
                    </div>
                    <p>Коэфицент зависит от количества монополий во владении игрока, где цвет генерируемого сияния
                        зависит от
                        положения на доске</p>
                </v-card>
            </div>
            <div>
                <v-card>
                    <v-card-title>Текущие настройки</v-card-title>
                    <div class="value__container">
                        <p class="value__description">Базовое значение в час</p>
                        <v-spacer></v-spacer>

                        <div class="value__wrapper">
                            <v-form ref="emailForm" v-model="emailForm" lazy-validation>
                                <v-text-field
                                    style="padding-top: 0px; margin-right: 5px;"
                                    v-model="globalFactor"
                                    :rules="baseFactorRule"
                                    min="1"
                                    type="number"
                                    label="Базовое значение"
                                    single-line
                                    hide-details
                                ></v-text-field>
                            </v-form>
                        </div>
                    </div>
                </v-card>
                <v-card>
                    <div class="value__container">
                        <p class="value__description">
                            5-ти полевая сторона
                            <span>
                        значения расположены слева на право, где порядок элемента определяет значение множителя, за владение: одним полем, двумя и т.д
                    </span>
                            <span>
                        например чтобы задать множитель для владения тремя полями необходимо отредактировать третий элемент слева
                    </span>
                        </p>
                        <ShineValues :values="gameShineFactor.fiveSideFactor" :baseFactor="globalFactor" />
                    </div>
                    <div class="value__container">
                        <p class="value__description">
                            6-ти полевая сторона
                            <span>
                        значения расположены слева на право, где порядок элемента определяет значение множителя, за владение: одним полем, двумя и т.д
                    </span>
                            <span>
                        например чтобы задать множитель для владения тремя полями необходимо отредактировать третий элемент слева
                    </span>
                        </p>
                        <ShineValues :values="gameShineFactor.sixSideFactor" :baseFactor="globalFactor" />
                    </div>
                    <div class="value__container">
                        <p class="value__description">
                            Множители для красных и розовых монополий
                            <span>
                        значения расположены слева на право, где порядок элемента определяет значение множителя, за владение: одним полем, двумя и т.д
                    </span>
                            <span>
                        например чтобы задать множитель для владения тремя полями необходимо отредактировать третий элемент слева
                    </span>
                        </p>
                        <ShineValues :values="gameShineFactor.specialMonopolyFactor" :baseFactor="globalFactor" />
                    </div>
                    <div class="value__actions">
                        <v-btn color="gray darken-1" text @click="clearForm">
                            Сбросить
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="saveForm">
                            Сохранить
                        </v-btn>
                    </div>
                </v-card>
            </div>
        </div>
        <v-snackbar
            v-model="snackbar"
        >
            {{ snackText }}

            <template v-slot:action="{ attrs }">
                <v-btn
                    color="blue"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                >
                    Закрыть
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import ShineValues from "../components/shines/ShineValues";

export default {
    name: "Shines",
    components: { ShineValues },
    data() {
        return {
            snackbar: false,
            snackText: 'Данные сохранены',
            emailForm: true,
            globalFactor: null,
            gameShineFactor: {
                fiveSideFactor: null,
                sixSideFactor: null,
                specialMonopolyFactor: null,
            },
            baseFactorRule: [
                v => v > 0 || "Значение должно быть больше единицы",
            ],
        };
    },
    async mounted() {
        await this.$socket.client.emit("get_shine_config", {}, (data) => {
            this.globalFactor = data.BASE_VALUE;
            this.gameShineFactor.fiveSideFactor = Object.values(data.CELL_COUNT_FACTORS.FIVE_SIDE_FACTORS);
            this.gameShineFactor.sixSideFactor = Object.values(data.CELL_COUNT_FACTORS.SIX_SIDE_FACTORS);
            this.gameShineFactor.specialMonopolyFactor = Object.values(data.CELL_COUNT_FACTORS.SPECIAL_SIDE_FACTORS);
        });
    },
    methods: {
        saveForm() {
            this.$socket.client.emit("save_shine_config", {
                baseFactor: this.globalFactor,
                sideFactors: this.gameShineFactor,
            }, (response) => {
                if (response.success) {
                    this.showSnack()
                }
            });
        },
        clearForm() {

        },
        showSnack() {
            this.snackbar = true
            setTimeout(() => {
                this.snackbar = false
            }, 5000)
        }
    },
};
</script>

<style scoped lang="scss">
* {
    box-sizing: border-box;
}

.value__container {
    padding: 0 15px;
    display: flex;
    flex-wrap: wrap;
}

.f-col {
    flex-direction: column;
}

.value__description {
    width: 100%;
    margin-bottom: 0;
    margin-top: 25px;
    line-height: 1;
    font-size: 18px;

    span {
        display: block;
        font-size: 12px;
    }
}

.description__block {
    flex: 1;
    margin-right: 15px;
}

.value__actions {
    padding: 15px;
    justify-content: flex-end;
    display: flex;
}

.block__container {
    display: flex;

    @media screen and (max-width: 1900px){
        flex-wrap: wrap;
    }
}

.value__wrapper {
    display: flex;
}

.value__input {
    width: 50px;
}
</style>
