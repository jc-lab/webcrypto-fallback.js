import {
  shim
} from './index';

const browserWindow = typeof self !== 'undefined' ? self : null;
if (browserWindow && !browserWindow.isSecureContext) {
  // Internet Explorer : isSecureContext === undefined
  // Insecure context  : isSecureContext === false
  shim(browserWindow);
}
