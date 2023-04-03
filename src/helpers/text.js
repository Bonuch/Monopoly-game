
/**
 * Выводит правильное склонение в зависимости от числа
 * @param {number} count
 * @param {Array} cases ['Друг', 'Друга', 'Друзей']
 * @param {String} numberPosition '<', '>' (подставить count перед/после case)
 * @returns {string}
 */
export function setCase(count, cases, numberPosition = null) {
    if (count === undefined || count === null || !Number.isInteger(count)) return '';

    let result = '';

    if (count >= 10 && count <= 20) {
        result = cases[2];
    } else {
        const tmp = count % 10;
        switch (tmp) {
            case 1:
                result = cases[0];
                break;
            case 2:
            case 3:
            case 4:
                result = cases[1];
                break;
            case 0:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                result = cases[2];
                break;
        }
    }

    if (numberPosition === '>') {
        result = result + ' ' + count;
    } else if (numberPosition === '<') {
        result = count + ' ' + result;
    }
    return result;
}


export function truncate(text, stop, clamp) {
    return text ? text.slice(0, stop).trim() + (stop < text.length ? clamp || '...' : '') : '';
}


export function exists(something, string = null) {
    if (something) {
        return (string) ? `${something}${string}` : something;
    }
    return '';
}

