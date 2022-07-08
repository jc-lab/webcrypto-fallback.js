import * as webcryptoLiner from 'webcrypto-liner/build/index';

function WrapFunction(subtle: any, name: string) {
  const fn = subtle[name];
  // tslint:disable-next-line:only-arrow-functions
  subtle[name] = function () {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    return new Promise((resolve, reject) => {
      const op: any = fn.apply(subtle, args);
      if (op.then) {
        op
          .then((result) => resolve(result))
          .catch((err) => reject(err));
      } else {
        op.oncomplete = (e: any) => {
          resolve(e.target.result);
        };
        op.onerror = (e: any) => {
          reject(`Error on running '${name}' function`);
        };
      }
    });
  };
}

export function shim(window: any) {
  const nativeCrypto = webcryptoLiner.nativeCrypto;
  const nativeSubtle = webcryptoLiner.nativeSubtle;

  if (nativeCrypto) {
    Object.freeze(nativeCrypto.getRandomValues);
  }

  if (typeof self !== 'undefined' && self['msCrypto']) {
    WrapFunction(nativeSubtle, 'generateKey');
    WrapFunction(nativeSubtle, 'digest');
    WrapFunction(nativeSubtle, 'sign');
    WrapFunction(nativeSubtle, 'verify');
    WrapFunction(nativeSubtle, 'encrypt');
    WrapFunction(nativeSubtle, 'decrypt');
    WrapFunction(nativeSubtle, 'importKey');
    WrapFunction(nativeSubtle, 'exportKey');
    WrapFunction(nativeSubtle, 'wrapKey');
    WrapFunction(nativeSubtle, 'unwrapKey');
    WrapFunction(nativeSubtle, 'deriveKey');
    WrapFunction(nativeSubtle, 'deriveBits');
  }

  // fix: Math.imul for IE
  if (!(Math as any).imul) {
    // tslint:disable-next-line:only-arrow-functions
    (Math as any).imul = function imul(a: number, b: number) {
      const ah = (a >>> 16) & 0xffff;
      const al = a & 0xffff;
      const bh = (b >>> 16) & 0xffff;
      const bl = b & 0xffff;
      return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
    };
  }

  try {
    delete (window as any).crypto;
    window.crypto = new webcryptoLiner.Crypto();
    Object.freeze(window.crypto);
  } catch (e) {
    console.error(e);
  }
}
