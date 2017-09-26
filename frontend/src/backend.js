import BigNumber from 'bignumber.js';

import { get, post } from './utils';

class Backend {
  constructor (url) {
    this._url = url;
  }

  url (path) {
    return `${this._url}/api${path}`;
  }

  blockHash () {
    return get(this.url('/block/hash'));
  }

  async getAccountFeeInfo (address) {
    const { balance, paid } = await get(this.url(`/accounts/${address}/fee`));

    return {
      balance: new BigNumber(balance),
      paid
    };
  }

  async certifierAddress () {
    const { certifier } = await get(this.url(`/certifier`));

    return certifier;
  }

  async fee () {
    const { fee, feeRegistrar } = await get(this.url(`/fee`));

    return { fee: new BigNumber(fee), feeRegistrar };
  }

  async getAddressInfo (address) {
    const { eth, accounted, certified } = await get(this.url(`/accounts/${address}`));

    return {
      eth: new BigNumber(eth),
      accounted: new BigNumber(accounted),
      certified
    };
  }

  async nonce (address) {
    const { nonce } = await get(this.url(`/accounts/${address}/nonce`));

    return nonce;
  }

  async sendFeeTx (tx) {
    const { hash } = await post(this.url('/fee-tx'), { tx });

    return { hash };
  }

  async sendTx (tx) {
    const { hash, requiredEth } = await post(this.url('/tx'), { tx });

    return { hash, requiredEth };
  }
}

const { protocol, hostname, port } = window.location;
const frontendPort = port ? ':4000' : '';

export default new Backend(`${protocol}//${hostname}${frontendPort}`);
