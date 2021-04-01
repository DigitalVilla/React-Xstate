import { createMachine } from 'xstate'

export const timeMachine = createMachine({
  id: 'TimeMachine',
  initial: 'idle',
  states: {
    idle: {
      on: {
        TOGGLE: 'running',
      },
    },
    running: {
      on: {
        RESET: 'idle',
        TOGGLE: 'paused',
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
