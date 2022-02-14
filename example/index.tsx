import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useFileHashCode, useStringHashCode } from '../dist'

const App = () => {
  const file = new File([], '')
  const { isHashLoading, isHashError, sha256 } = useFileHashCode(file, 'sha256')
  const strMd5 = useStringHashCode('Hello, World', 'md5')

  return (
    <div>
      {sha256}
      {strMd5}
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))
