import React, { useEffect } from 'react'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ProgressCircle } from '../ProgressCircle'
import { timerMachine, updatedState, timer } from './timerMachine'
import { useMachine } from '@xstate/react'

export const Timer = () => {
  const [state, send] = useMachine(timerMachine)
  const { duration, elapsed, interval } = state.context
  const { is } = updatedState(state)
  useEffect(() => {
    const intervalId = setInterval(() => send('TICK'), interval * 1000)
    return () => clearInterval(intervalId)
    // eslint-disable-next-line
  }, [])

  const onToggle = () => send({ type: 'TOGGLE' })
  const onResetClick = () =>
    send(is(['paused', 'running.overtime'], 'RESET', 'PLUS'))
  const timerStr = `+${timer.toFixed(2)}`.replace('.', ':')
  const timerDisplay = (duration - elapsed).toFixed('1')
  const stateDisplay =
    state.toStrings().length === 2 ? state.toStrings()[1] : state.value

  return (
    <div
      className="timer"
      data-state={state.toStrings().join(' ')}
      style={{
        // @ts-ignore
        '--duration': duration,
        '--elapsed': elapsed,
        '--interval': interval,
      }}
    >
      <header>
        <h1>Exercise 06</h1>
      </header>
      <ProgressCircle />
      <div className="display">
        <div className="label">{stateDisplay.toUpperCase()}</div>
        <div className="elapsed noSelect" onClick={onToggle}>
          {timerDisplay}
        </div>
        <div className="controls">
          <button disabled={is('idle')} onClick={onResetClick}>
            {is(['paused', 'running.overtime'], 'Reset', timerStr)}
          </button>
        </div>
      </div>

      <div className="actions">
        <button
          disabled={is('running.overtime')}
          title="Start/Pause timer"
          onClick={onToggle}
        >
          <FontAwesomeIcon icon={is('running', faPause, faPlay)} />
        </button>
      </div>
    </div>
  )
}
