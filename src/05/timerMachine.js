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

const greaterThanZero = (ctx) => ctx.elapsed >= ctx.duration

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
        always: {
          target: 'expired',
          cond: 'greaterThanZero',
        },
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
      expired: {
        on: {
          RESET: 'idle',
        },
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
      greaterThanZero,
    },
  }
)

// Returns boolean or ternary value
export const updatedState = (state) => {
  const validateState = (newState, success, defaults, reversed = false) => {
    let contains = false
    if (typeof newState === 'object' && newState.length) {
      contains = newState.includes(state.value)
    } else {
      contains = state.value === newState
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
