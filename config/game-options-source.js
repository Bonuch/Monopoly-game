'use strict';
// TODO заполнить описание

//     • 15. Без аукционов -
//
//     • 16. Без залогов -
//
//     • 17. Моя моно - мои правила -
//
//     • 18. Строительный бум -
//
//     • 19. Заключенный -
//
//     • 20. Честные торги
//

const gameOptionsSource = {
    leniency: {
        id: 'leniency',
        name: 'Снисходительность',
        description: 'Владелец монополии может сделать скидку попавшему на его монополию игроку',
        image: '/design/game-mutations/hiquality/mutation_0013_snishod2.png'
    },
    sale: {
        id: 'sale',
        name: 'Распродажа',
        description: 'При банкротстве, поля выбывшего игрока распродаются на аукционе',
        image: '/design/game-mutations/hiquality/mutation_0008_rasprodazha2.png'
    },
    takeover: {
        id: 'takeover',
        name: 'Рейдерский захват',
        description: 'Anonymous предоставляет возможность захватить чужое поле и защитить свое от захвата',
        image: '/design/game-mutations/hiquality/mutation_0001_raider.png'
    },
    firstmoveright: {
        id: 'firstmoveright',
        name: 'Право первого хода',
        description: 'Кто ходит первым разыгрывается на аукционе за деньги. Начальная ставка 100, шаг ставки 50',
        image: '/design/game-mutations/hiquality/mutation_0020_first-start2.png'
    },
    nocredits: {
        id: 'nocredits',
        name: 'Без кредитов',
        description: 'Вип-игроки лишаются возможности брать кредит',
        image: '/design/game-mutations/hiquality/mutation_0017_no-credit-card.png'
    },
    doubledicenotpayed: {
        id: 'doubledicenotpayed',
        name: 'Дубль не засчитывается',
        description: 'При выпадении дубля, с игрока не взимается плата и он не может купить поле, но делает второй бросок кубиков',
        image: '/design/game-mutations/hiquality/mutation_0018_no-doubles.png'
    },
    fastgame: {
        id: 'fastgame',
        name: 'Быстрая игра',
        description: '15 секунд на ход, аукцион и автоматическая оплата',
        image: '/design/game-mutations/hiquality/mutation_0011_rushgame.png'
    },
    richancestors: {
        id: 'richancestors',
        name: 'Богатые предки',
        description: 'При прохождении поля “Старт”, начисляется не 2000, а 4000',
        image: '/design/game-mutations/hiquality/mutation_0009_rich-parents.png'
    },
    crysis: {
        id: 'crysis',
        name: 'Кризис',
        description: 'При прохождении поля “Старт”, начисляется не 2000, а 200',
        image: '/design/game-mutations/hiquality/mutation_0004_crisis2.png'
    },
    commonmoney: {
        id: 'commonmoney',
        name: 'Общак',
        description: 'Налоги, собранные с игроков собираются в банке, и переходят игроку остановившемуся на поле “Старт” и «?»',
        image: '/design/game-mutations/hiquality/mutation_0016_obshack.png'
    },
    richancestors2: {
        id: 'richancestors2',
        name: 'Богатые предки 2',
        description: 'Здесь будет описание опции',
        image: '/design/game-mutations/hiquality/mutation_0009_rich-parents.png'
    },
    eyesofsnake: {
        id: 'eyesofsnake',
        name: 'Глаза змеи',
        description: 'При выбросе дубля 1-1 игроку начисляются 2000',
        image: '/design/game-mutations/hiquality/mutation_0012_snake-eyes.png'
    },
    yourchance: {
        id: 'yourchance',
        name: 'Твой шанс',
        description: 'При попадании на поле Шанс игрок имеет право отказаться от действия вменяемого полем',
        image: '/design/game-mutations/hiquality/mutation_0007_your-chance.png'
    },
    yourchance2: {
        id: 'yourchance2',
        name: 'Твой шанс 2',
        description: 'Игрок не знает, что ему выпало на поле Шанс, но может отказаться или принять свою судьбу',
        image: '/design/game-mutations/hiquality/mutation_0007_your-chance-2.png'
    },
    noauctions: {
        id: 'noauctions',
        name: 'Без аукционов',
        description: 'В игре отключены аукционы',
        image: '/design/game-mutations/hiquality/mutation_0005_auction-no.png'
    },
    nobails: {
        id: 'nobails',
        name: 'Без залогов',
        description: 'Поля нельзя заложить, можно только продать в игру за 75% от номинала',
        image: '/design/game-mutations/hiquality/mutation_0019_no-bail.png'
    },
    myrules: {
        id: 'myrules',
        name: 'Моя моно - мои правила',
        description: 'Можно строить и продавать филиалы не последовательно в любом порядке по 1 филиалу на 1 моно за ход',
        image: '/design/game-mutations/hiquality/mutation_0021_my-rules.png',
        requires: ['buildingboom'],
        alert: 'Чтобы включить опцию «Моя моно - мои правила» сначала выключите опцию «Строительный бум»'
    },
    buildingboom: {
        id: 'buildingboom',
        name: 'Строительный бум',
        description: 'Можно строить любые владеемые поля в любой последовательности, но по 1 филиалу на 1 поле за ход',
        image: '/design/game-mutations/hiquality/mutation_0014_stroit-boom.png',
        requires: ['myrules'],
        alert: 'Чтобы включить опцию «Строительный бум» сначала выключите опцию «Моя моно - мои правила»'
    },
    prisoner: {
        id: 'prisoner',
        name: 'Заключенный',
        description: 'Пока игрок в тюрьме его поля не приносят дохода если на них кто то попал, в том числе Ложи',
        image: '/design/game-mutations/hiquality/mutation_0015_prisoner.png'
    },
    fairtrades: {
        id: 'fairtrades',
        name: 'Честные торги',
        description: 'Обмены невозможны до тех пор, пока игроки не купят все поля в игре',
        image: '/design/game-mutations/hiquality/mutation_0003_fair-trade.png'
    },
    oldmoney: {
        id: 'oldmoney',
        name: 'Старые деньги',
        description: 'При прохождении поля “Старт” начисляется не 2000 а 20000',
        image: '/design/game-mutations/hiquality/mutation_0010_rich-parents3.png'
    },
    // clover: {
    //     id: 'clover',
    //     name: 'Твой шанс',
    //     description: 'Здесь будет описание опции',
    //     image: '/design/game-mutations/hiquality/mutation_0002_clover.png'
    // }
};

module.exports = gameOptionsSource;
