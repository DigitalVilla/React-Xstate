import * as React from 'react'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ProgressCircle } from '../ProgressCircle'

// Import the timer machine and its initial state:
import { timeMachine } from './timerMachine'
import { useMachine } from '@xstate/react'

export const Timer = () => {
  const [state, send] = useMachine(timeMachine)

  const { duration, elapsed, interval } = {
    duration: 60,
    elapsed: 0,
    interval: 0.1,
  }

  return (
    <div
      className="timer"
      data-state={state.value}
      style={{
        // @ts-ignore
        '--duration': duration,
        '--elapsed': elapsed,
        '--interval': interval,
      }}
    >
      <header>
        <h1>Exercise 01</h1>
      </header>
      <ProgressCircle />
      <div className="display">
        <div className="label">{state.value.toUpperCase()}</div>
        <div className="elapsed" onClick={() => send({ type: 'TOGGLE' })}>
          {Math.ceil(duration - elapsed)}
        </div>
        <div className="controls">
          <button
            className="reset-button"
            // data-state={state.value}
            disabled={state.value === 'idle'}
            onClick={() => send({ type: 'RESET' })}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="actions">
        <button
          title="Start/Pause timer"
          onClick={() => send({ type: 'TOGGLE' })}
        >
          <FontAwesomeIcon
            icon={state.value === 'running' ? faPause : faPlay}
          />
        </button>
      </div>
    </div>
  )
}
