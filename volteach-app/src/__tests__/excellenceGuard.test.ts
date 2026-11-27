import { describe, it, expect } from 'vitest';
import { createAiGuard } from '../server/aiGuard';
describe('AI gateway aggregate quota', () => {
 it('caps requests across distinct users and resets after window', async () => {
  let now = 100;
  const guard = createAiGuard(async token => token, () => now, 2, 1000, 10, 3);
  const call = (uid:string) => guard('Bearer '+uid,{prompt:'test'});
  expect((await call('a')).ok).toBe(true);
  expect((await call('b')).ok).toBe(true);
  expect((await call('c')).ok).toBe(true);
  expect(await call('d')).toMatchObject({ok:false,status:429});
  now += 1000;
  expect((await call('d')).ok).toBe(true);
 });
 it('does not charge invalid authentication or malformed prompts', async () => {
  const guard = createAiGuard(async token => {if(token==='bad')throw Error();return token;}, () => 100, 2, 1000, 10, 1);
  expect(await guard('Bearer bad',{prompt:'test'})).toMatchObject({ok:false,status:401});
  expect(await guard('Bearer a',{prompt:''})).toMatchObject({ok:false,status:400});
  expect((await guard('Bearer a',{prompt:'valid'})).ok).toBe(true);
  expect(await guard('Bearer b',{prompt:'valid'})).toMatchObject({ok:false,status:429});
 });
 it('rejects invalid quota configuration', () => {
  expect(()=>createAiGuard(async t=>t, Date.now, 20, 60000, 100, 0)).toThrow();
 });
});
