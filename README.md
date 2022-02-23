# Installation

npm:

```shell
npm i use-hashcode
```

yarn:

```shell
yarn add use-hashcode
```

## Prepare
make sure you have crypto-js
```shell
npm i crypto-js
```
or
```shell
yarn add crypto-js
```

## Summary

This package makes hash things easier in react using crypto-js

## Usage

````tsx
import { useFileHashCode } from 'use-hashcode'

const App = () => {
  const { isHashLoading, isHashError, sha256 } = useFileHashCode(file, 'sha256')
  const strMd5 = useStringHashCode('Hello, World', 'md5')

  return (
    <div>
      {sha256}
      {strMd5}
    </div>
  )
}
````

## Hooks

### 1.useFileHashCode:

#### get hash code of file(include huge file), can custom chunk size, support MD5, Sha1, Sha256, Sha512

### 2.useStringHashCode:

#### get hash code of string, support MD5, Sha1, Sha256,Sha512