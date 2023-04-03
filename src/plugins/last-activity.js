import { debounce } from "lodash";

export default {
    install(Vue, options) {
        const lastActivity = new LastActivity(options)
        Vue.prototype.$lastActivity = lastActivity
        var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(function(name) {
            document.addEventListener(name, debounce(function() {
                lastActivity.resetTimer()
            }, 100), true);
        });
    }
}

const storage = {
    state: {
        lastActivityTime: 0,
    },
    getters: {
        lastActivityTime(state) {
            return state.lastActivityTime
        }
    },
    mutations: {
        setLastActivityTime(state, time) {
            state.lastActivityTime = time
        }
    },
}

class WindowStore {
    constructor() {
        this._lastActivityTime = 0
    }

    get lastActivityTime() {
        return this._lastActivityTime
    }

    setLastActivityTime(value) {
        this._lastActivityTime = value
    }

}

class LastActivity {
    constructor({ store, limit }) {
        if (store) {
            store.registerModule('lastActivity', storage)
            this.saveToStore = (val) => store.commit('setLastActivityTime', val)
        } else {
            this.saveToStore = (val) => window.lastActivity.time = val
        }
        this._time = 0
        this._startTime = this.getTime()
        this._timer = null
        this._maxLimit = limit ?? 180           // seconds
        this._stopTimer = false
        this.startInterval()
    }

    get time() {
        return Math.floor((this._time - this._startTime) / 1000)
    }

    get limitReached() {
        return this.time >= this._maxLimit
    }

    set time(val) {
        this._time = val
        this.saveToStore(this.time)
    }

    startInterval() {
        this._startTime = this.getTime()
        this._timer = setInterval(() => {
            this.time = this.getTime()
            if (this.limitReached) {
                this._toggleTimer()
                clearInterval(this._timer)
            }
        }, 1000);
    }

    getTime() {
        return new Date().getTime()
    }

    _toggleTimer() {
        this._stopTimer = !this._stopTimer;
    }

    resetTimer() {
        clearInterval(this._timer)
        if (this.limitReached && this._stopTimer) {
            this._startTime = this.getTime()
            this._toggleTimer()
        }
        this.startInterval()
    }

}
