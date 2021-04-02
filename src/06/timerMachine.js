import { assign, createMachine } from 'xstate'
export const timer = 5
const tick = assign({
  elapsed: (ctx) => ctx.elapsed + ctx.interval,
})

const plusOne = assign({
  duration: (ctx) => ctx.duration + timer,
})

const reset = assign({
  duration: timer,
  elapsed: 0,
})

const timerExpired = (ctx) => ctx.elapsed >= ctx.duration

export const timerMachine = createMachine(
  {
    id: 'TimeMachine',
    initial: 'idle',
    context: {
      duration: timer,
      elapsed: 0,
      interval: 0.1,
    },
    states: {
      idle: {
        entry: 'reset',
        on: {
          TOGGLE: 'running',
        },
      },
      running: {
        initial: 'normal',
        states: {
          normal: {
            always: {
              target: 'overtime',
              cond: 'timerExpired',
            },
          },
          overtime: {
            after: {
              [timer * 1000]: 'timeOver',
            },
            on: {
              TOGGLE: undefined,
            },
          },
          timeOver: {
            type: 'final',
          },
        },
        onDone: 'idle',

        on: {
          TOGGLE: 'paused',
          TICK: {
            actions: 'tick',
          },
          PLUS: {
            actions: 'plusOne',
          },
        },
      },
      paused: {
        on: {
          TOGGLE: 'running',
          RESET: 'idle',
        },
      },
    },
    on: {
      RESET: {
        target: '.idle',
      },
    },
  },
  {
    actions: {
      tick,
      plusOne,
      reset,
    },
    guards: {
      timerExpired,
    },
  }
)

// Returns boolean or ternary value
export const updatedState = (state) => {
  const validateState = (newState, success, defaults, reversed = false) => {
    let contains = false
    let value =
      typeof state.value === 'object' ? state.toStrings()[1] : state.value
    if (typeof newState === 'object' && newState.length) {
      contains = newState.includes(value)
    } else {
      contains = value === newState
    }
    if (reversed) contains = !contains
    if (success) return contains ? success : defaults

    return contains
  }

  return {
    is: (s, a, b) => validateState(s, a, b),
    isNot: (s, a, b) => validateState(s, a, b, true),
  }
}
