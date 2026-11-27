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

describe('AI gateway boundary and concurrency', () => {
 it('rejects missing, malformed and simulated revoked tokens',async()=>{
  const guard=createAiGuard(async t=>{if(t==='revoked')throw Error();return t;});
  for(const authorization of [undefined,'Basic abc','Bearer a b','Bearer revoked'])
   expect(await guard(authorization,{prompt:'test'})).toMatchObject({ok:false,status:401});
 });
 it('rejects invalid bodies before charging quota',async()=>{
  const guard=createAiGuard(async t=>t,()=>10,1,1000,10,1);
  for(const body of [null,{}, {prompt:'  '},{prompt:1},{prompt:'x'.repeat(20001)}])
   expect(await guard('Bearer a',body)).toMatchObject({ok:false,status:400});
  expect((await guard('Bearer a',{prompt:'x'})).ok).toBe(true);
 });
 it('concurrent requests cannot exceed the single-process aggregate quota',async()=>{
  const guard=createAiGuard(async t=>t,()=>10,20,1000,100,3);
  const results=await Promise.all(Array.from({length:20},(_,i)=>guard('Bearer u'+i,{prompt:'x'})));
  expect(results.filter(r=>r.ok)).toHaveLength(3);
  expect(results.filter(r=>!r.ok&&r.status===429)).toHaveLength(17);
 });
 it('enforces identity capacity and removes expired buckets',async()=>{
  let now=10; const guard=createAiGuard(async t=>t,()=>now,20,1000,1,100);
  expect((await guard('Bearer a',{prompt:'x'})).ok).toBe(true);
  expect(await guard('Bearer b',{prompt:'x'})).toMatchObject({ok:false,status:503});
  now+=1000;expect((await guard('Bearer b',{prompt:'x'})).ok).toBe(true);
 });
});
