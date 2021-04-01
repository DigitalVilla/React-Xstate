import { assign, createMachine } from 'xstate'

export const timeMachine = createMachine({
  id: 'TimeMachine',
  initial: 'idle',
  context: {
    duration: 60,
    elapsed: 0,
    increment: 0.1,
  },
  states: {
    idle: {
      entry: assign({
        duration: 60,
        elapsed: 0,
      }),
      on: {
        TOGGLE: 'running',
      },
    },
    running: {
      on: {
        TOGGLE: 'paused',
        ADD_MINUTE: {
          target: undefined, // DEFAULT, state stays the same,
          actions: assign({
            duration: (ctx) => ctx.duration + 60,
          }),
        },
      },
    },
    paused: {
      on: {
        RESET: 'idle',
        TOGGLE: 'running',
      },
    },
  },
})

// Returns boolean or ternary value
export const onState = (state) => {
  return (newState, success, defaults) => {
    const contains = state.value === newState
    if (success) return contains ? success : defaults
    return contains
  }
}
