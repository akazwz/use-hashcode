import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useHashFileCode } from '../dist'

const App = () => {
  const file = new File([], '')
  const { isHashLoading, isHashError, sha256, } = useHashFileCode(file, 'sha256')

  return (
    <div>
      {sha256}
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))
