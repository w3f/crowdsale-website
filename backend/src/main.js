// Copyright Parity Technologies (UK) Ltd., 2017.
// Released under the Apache 2/MIT licenses.

'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const Sale = require('./sale');

const app = new Koa();
const router = new Router();
const sale = new Sale('ws://127.0.0.1:8546/', '0x385FdDdF25d299f51657639eEe73c79bDA08062c');

router.get('/:address/nonce', async (ctx, next) => {
  const { address } = ctx.params;

  const nonce = await sale.connector.nextNonce(address);

  ctx.body = { nonce };
});

router.post('/tx', async (ctx, next) => {
  const { tx } = ctx.request.body;

  try {
    const hash = await sale.connector.sendTx(tx);

    ctx.body = { hash };
  } catch (error) {
    ctx.status = 400;
    ctx.body = error.message;
    ctx.app.emit('error', error, ctx);
  }
});

router.get('/', (ctx) => {
  const {
    contractAddress,
    statementHash,
    buyinId,
    block,
    price,
    begin,
    end,
    status,
    available,
    cap,
    bonusDuration,
    bonusSize
  } = sale;

  ctx.body = {
    contractAddress,
    statementHash,
    buyinId,
    block,
    price,
    begin,
    end,
    status,
    available,
    cap,
    bonusDuration,
    bonusSize
  };
});

app
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(4000);
