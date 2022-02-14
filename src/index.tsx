import { useEffect, useRef, useState } from 'react'
import CryptoJs from 'crypto-js'
import encHex from 'crypto-js/enc-hex'

export interface Encoder {
  stringify (wordArray: WordArray): string;

  parse (str: string): WordArray;
}

export interface WordArray {
  words: number[];
  sigBytes: number;

  toString (encoder?: Encoder): string;

  concat (wordArray: WordArray): this;

  clamp (): void;

  clone (): WordArray;
}

export interface Hasher {
  reset (): void;

  update (messageUpdate: WordArray | string): this;

  finalize (messageUpdate?: WordArray | string): WordArray;
}

export interface IUseHashFileReturn {
  isHashLoading: boolean, // is hash loading
  isHashError: boolean, // is hash error
  md5: string | null, // hashcode md5
  sha1: string | null, // hashcode sha1
  sha256: string | null, // hashcode -sha256
  sha512: string | null, // hashcode -sha512
  timeSpend: number | null, // time spend
}

/**
 * hash file
 * @param file the file need to hash
 * @param hashAlgo hash algorithm 'md5' |'sha1'| 'sha256'  default:sha256
 * @param chunkSizeCustom   chunk size default:10M
 * @return IUseHashFileReturn
 */
export const useFileHashCode = (file: File | null, hashAlgo?: 'md5' | 'sha1' | 'sha256' | 'sha512', chunkSizeCustom?: number): IUseHashFileReturn => {
  const startTimeRef = useRef<number | null>(null)
  const [isHashLoading, setIsHashLoading] = useState<boolean>(true)
  const [isHashError, setIsHashError] = useState<boolean>(false)
  const [md5, setMd5] = useState<string | null>(null)
  const [sha1, setSha1] = useState<string | null>(null)
  const [sha256, setSha256] = useState<string | null>(null)
  const [sha512, setSha512] = useState<string | null>(null)
  const [timeSpend, setTimeSpend] = useState<number | null>(null)

  useEffect(() => {
    if (!file) return
    /* record start time */
    startTimeRef.current = Date.now()

    const hashFileInternal = (file: File, alog: Hasher) => {
      let chunkSize = 1024 * 1024 * 10
      /* custom chunk size */
      if (chunkSizeCustom) {
        chunkSize = chunkSizeCustom
      }
      let promise = Promise.resolve()
      for (let index = 0; index < file.size; index += chunkSize) {
        promise = promise.then(() => hashBlob(file.slice(index, index + chunkSize)))
      }

      /* arraybuffer to word array */
      function arrayBufferToWordArray (ab: ArrayBuffer) {
        const i8a = new Uint8Array(ab)
        const a = []
        for (let i = 0; i < i8a.length; i += 4) {
          a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3])
        }
        return CryptoJs.lib.WordArray.create(a, i8a.length)
      }

      /* hash blob */
      const hashBlob = (blob: Blob) => {
        return new Promise<void>((resolve) => {
          const reader = new FileReader()
          reader.onload = ({ target }) => {
            if (!target!.result) return
            if (typeof target!.result === 'string') return
            const wordArray = arrayBufferToWordArray(target!.result)
            // update hash
            alog.update(wordArray)
            resolve()
          }
          reader.readAsArrayBuffer(blob)
        })
      }

      return promise.then(() => encHex.stringify(alog.finalize()))
    }

    const hashFileSha256 = () => {
      hashFileInternal(file, CryptoJs.algo.SHA256.create()).then((sha256) => {
        setSha256(sha256)
        if (startTimeRef.current) {
          const t = Date.now() - startTimeRef.current
          setTimeSpend(t)
        }
      }).catch(() => {
        setIsHashError(true)
        setIsHashLoading(false)
      })
    }

    /* chose algo */
    switch (hashAlgo) {
      case 'md5':
        hashFileInternal(file, CryptoJs.algo.MD5.create()).then((md5) => {
          setMd5(md5)
          if (startTimeRef.current) {
            const t = Date.now() - startTimeRef.current
            setTimeSpend(t)
          }
        }).catch(() => {
          setIsHashError(true)
          setIsHashLoading(false)
        })
        break
      case 'sha1':
        hashFileInternal(file, CryptoJs.algo.SHA1.create()).then((sha1) => {
          setSha1(sha1)
          if (startTimeRef.current) {
            const t = Date.now() - startTimeRef.current
            setTimeSpend(t)
          }
        }).catch(() => {
          setIsHashError(true)
          setIsHashLoading(false)
        })
        break
      case 'sha256':
        hashFileSha256()
        break
      case 'sha512':
        hashFileInternal(file, CryptoJs.algo.SHA512.create()).then((sha512) => {
          setSha512(sha512)
          if (startTimeRef.current) {
            const t = Date.now() - startTimeRef.current
            setTimeSpend(t)
          }
        }).catch(() => {
          setIsHashError(true)
          setIsHashLoading(false)
        })
        break
      default:
        hashFileSha256()
    }
  }, [chunkSizeCustom, file, hashAlgo])

  return {
    isHashLoading,
    isHashError,
    md5,
    sha1,
    sha256,
    sha512,
    timeSpend,
  }
}

export const useStringHashCode = (msg: string, hashAlgo?: 'md5' | 'sha1' | 'sha256' | 'sha512'): string => {
  switch (hashAlgo) {
    case 'md5':
      return CryptoJs.MD5(msg).toString()
    case 'sha1':
      return CryptoJs.SHA1(msg).toString()
    case 'sha256':
      return CryptoJs.SHA256(msg).toString()
    case 'sha512':
      return CryptoJs.SHA512(msg).toString()
    default:
      return CryptoJs.SHA256(msg).toString()
  }
}


