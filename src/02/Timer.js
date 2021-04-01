import * as React from 'react'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ProgressCircle } from '../ProgressCircle'
import { timeMachine, onState } from './timerMachine'
import { useMachine } from '@xstate/react'

export const Timer = () => {
  const [state, send] = useMachine(timeMachine)
  const { duration, elapsed, interval } = state.context
  const on = onState(state)

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
        <h1>Exercise 02</h1>
      </header>
      <ProgressCircle />
      <div className="display">
        <div className="label">{state.value.toUpperCase()}</div>
        <div className="elapsed" onClick={() => send({ type: 'TOGGLE' })}>
          {Math.ceil(duration - elapsed)}
        </div>
        <div className="controls">
          <button
            disabled={on('idle')}
            onClick={() => send(on('paused', 'RESET', 'ADD_MINUTE'))}
          >
            {on('paused', 'Reset', '+ 1:00')}
          </button>
        </div>
      </div>

      <div className="actions">
        <button
          title="Start/Pause timer"
          onClick={() => send({ type: 'TOGGLE' })}
        >
          <FontAwesomeIcon icon={on('running', faPause, faPlay)} />
        </button>
      </div>
    </div>
  )
}
