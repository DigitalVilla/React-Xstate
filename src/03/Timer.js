import React, { useEffect } from 'react'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ProgressCircle } from '../ProgressCircle'
import { timerMachine, currentState, timer } from './timerMachine'
import { useMachine } from '@xstate/react'

export const Timer = () => {
  const [state, send] = useMachine(timerMachine)
  const { duration, elapsed, interval } = state.context
  const { is } = currentState(state)

  useEffect(() => {
    if (is('running')) {
      const intervalId = setInterval(() => send('TICK'), interval * 1000)
      return () => clearInterval(intervalId)
    }
    // eslint-disable-next-line
  }, [state.value])

  useEffect(() => {
    if (duration - elapsed <= 0.1) send('STOP')
    // eslint-disable-next-line
  }, [state.context])

  const onToggle = () => send({ type: 'TOGGLE' })
  const onResetClick = () => send(is(['paused', 'stopped'], 'RESET', 'PLUS'))

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
        <h1>Exercise 03</h1>
      </header>
      <ProgressCircle />
      <div className="display">
        <div className="label">{state.value.toUpperCase()}</div>
        <div className="elapsed noSelect" onClick={onToggle}>
          {(duration - elapsed).toFixed('1')}
        </div>
        <div className="controls">
          <button disabled={is('idle')} onClick={onResetClick}>
            {is(
              ['paused', 'stopped'],
              'Reset',
              `+${timer.toFixed(2)}`.replace('.', ':')
            )}
          </button>
        </div>
      </div>

      <div className="actions">
        <button
          disabled={is('stopped')}
          title="Start/Pause timer"
          onClick={onToggle}
        >
          <FontAwesomeIcon icon={is('running', faPause, faPlay)} />
        </button>
      </div>
    </div>
  )
}
