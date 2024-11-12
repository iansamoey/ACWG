// src/paypal.d.ts

declare module '@paypal/react-paypal-js' {
  import { PayPalScriptProvider as ScriptProviderType, PayPalButtons as ButtonsType } from '@paypal/react-paypal-js';

  export const PayPalScriptProvider: ScriptProviderType;
  export const PayPalButtons: ButtonsType;
}
