# Installation
npm:
````shell
npm install use-hashcode
````

yarn:
````shell
yarn add use-hashcode
````

## Summary
This package makes hash things easier in react using crypto-js

## Usage

````tsx
import { useHashFileCode } from 'use-hashcode'

const App = () => {
  const { isHashLoading, isHashError, sha256 } = useHashFileCode(file, 'sha256')

  return (
    <div>
      {sha256}
    </div>
  )
}
````

## hooks

### 1.useHashFileCode: 

#### to get hash code of file(include huge file), can custom chunk size, support MD5, Sha1, Sha256