import { mapActions } from 'vuex';
import axios from '@/helpers/axios-instance';

export default {
    data() {
        return {
            localizedOptionTooltip: {
                eyesofsnake: 'Глаза змеи',
                oldmoney: 'Старые деньги',
                fastgame: 'Быстрая игра',
                richancestors: 'Богатые предки',
                sale: 'Распродажа',
                yourchance2: 'Твой шанс 2',
                firstmoveright: 'Право первого хода',
                myrules: 'Моя моно - мои правила',
                takeover: 'Рейдерский захват',
                clover: 'Твой шанс',
                fairtrades: 'Честные торги',
                noauctions: 'Без аукционов',
                nobails: 'Без залогов',
                doubledicenotpayed: 'Дубль не засчитывается',
                nocredits: 'Без кредитов',
                obschak: 'Общак',
                prisoner: 'Заключенный',
                buildingboom: 'Строительный бум',
                leniency: 'Снисходительность',
                crysis: 'Кризис'
            },
            host: process.env.VUE_APP_HOST,
            wsUrl: process.env.VUE_APP_WSHOST,
        }
    },
    computed: {

    },
    methods: {
        ...mapActions([
            'loadUserInfo',
            'loadUserLoot',
        ]),
        decodeOptionsBinary(optionsBinary) {
            let options = [];
            let flag = 0x1;
            let optionsArray = ['leniency', 'sale', 'takeover', 'firstmoveright', 'nocredits', 'doubledicenotpayed', 'fastgame', 'richancestors', 'crysis', 'commonmoney', 'oldmoney', 'eyesofsnake', 'yourchance', 'yourchance2', 'noauctions', 'nobails', 'myrules', 'buildingboom', 'prisoner', 'fairtrades'];

            for (let item of optionsArray) {
                if (flag & optionsBinary) {
                    options.push(item);
                }
                flag = flag << 1
            }

            return options;
        },
        joinGameRequest: (gameId, callback) => {
            axios.get("/join-game", { params: { game_id: gameId } })
            .then(response => {
                callback(response);
            });
        }
    }
}
