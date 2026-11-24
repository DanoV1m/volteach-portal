import { describe, expect, it } from 'vitest';
import { createAiGuard } from '../src/server/aiGuard';

const verify = async (token: string) => {
  if (token === 'bad') throw new Error('invalid');
  return token;
};
const body = {prompt:'Explain Ohm law'};
describe('AI request guard', () => {
  it('rejects missing or invalid authorization', async () => {
    const guard = createAiGuard(verify);
    expect(await guard(undefined, body)).toMatchObject({ok:false,status:401});
    expect(await guard('Bearer bad',body)).toMatchObject({ok:false,status:401});
  });
  it('validates prompt and size', async () => {
    const guard = createAiGuard(verify);
    for (const b of [null, {}, {prompt:42}, {prompt:' '}, {prompt:'x'.repeat(20001)}])
      expect(await guard('Bearer alice',b)).toMatchObject({ok:false,status:400});
  });
  it('enforces per-user quotas and expiry', async () => {
    let time=0;
    const guard=createAiGuard(verify,()=>time,2,1000);
    expect(await guard('Bearer alice',body)).toMatchObject({ok:true});
    expect(await guard('Bearer alice',body)).toMatchObject({ok:true});
    expect(await guard('Bearer alice',body)).toMatchObject({ok:false,status:429});
    expect(await guard('Bearer bob',body)).toMatchObject({ok:true});
    time=1000;
    expect(await guard('Bearer alice',body)).toMatchObject({ok:true});
  });
  it('bounds active user buckets',async()=>{
    const guard=createAiGuard(verify,()=>0,2,1000,1);
    await guard('Bearer alice',body);
    expect(await guard('Bearer bob',body)).toMatchObject({ok:false,status:503});
  });
});
