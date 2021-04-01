export const timerMachineConfig = {
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
}

export const timerMachine = (state, event) => {
  return (
    timerMachineConfig.states[state]?.on?.[event.type] ||
    timerMachineConfig.initial
  )
}
