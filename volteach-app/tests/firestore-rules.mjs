// Isolated Firestore emulator only. Never targets a live Firebase project.
import {initializeTestEnvironment, assertSucceeds, assertFails} from '@firebase/rules-unit-testing';
import {doc, getDoc, setDoc, updateDoc, serverTimestamp} from 'firebase/firestore';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
assert.ok(process.env.FIRESTORE_EMULATOR_HOST, 'Emulator required');
const env = await initializeTestEnvironment({projectId:'demo-volteach-security',firestore:{rules:readFileSync('firestore.rules','utf8')}});
try {
  const alice=env.authenticatedContext('alice').firestore();
  const bob=env.authenticatedContext('bob').firestore();
  const guest=env.unauthenticatedContext().firestore();
  await env.withSecurityRulesDisabled(async ctx=>{
    await setDoc(doc(ctx.firestore(),'config','keys'),{gemini:'synthetic'});
  });
  await assertFails(getDoc(doc(alice,'config','keys')));
  await assertFails(getDoc(doc(guest,'config','keys')));
  await assertFails(setDoc(doc(alice,'config','keys'),{gemini:'fake'}));
  await assertFails(setDoc(doc(alice,'users','alice'),{uid:'alice',email:'alice@example.invalid',createdAt:serverTimestamp(),xp:999}));
  await assertSucceeds(setDoc(doc(alice,'users','alice'),{uid:'alice',email:'alice@example.invalid',createdAt:serverTimestamp()}));
  await assertFails(getDoc(doc(bob,'users','alice')));
  await assertSucceeds(getDoc(doc(alice,'users','alice')));
  const formula=doc(alice,'users','alice','formulas','f1');
  await assertSucceeds(setDoc(formula,{id:'f1',userId:'alice',title:'Ohm',latex:'V=IR',createdAt:serverTimestamp()}));
  await assertFails(updateDoc(formula,{title:'x'.repeat(257)}));
  await assertFails(getDoc(doc(bob,'users','alice','formulas','f1')));
  const resource=doc(alice,'community_resources','r1');
  await assertSucceeds(setDoc(resource,{id:'r1',title:'Test',category:'notes',webViewLink:'https://example.invalid',institutionKey:'demo',courseTitle:'Demo',upvotes:0,upvotedBy:[],contributorName:'Test',contributorUid:'alice',createdAt:serverTimestamp()}));
  await assertSucceeds(updateDoc(resource,{upvotes:1,upvotedBy:['alice']}));
  await assertFails(updateDoc(resource,{upvotes:2,upvotedBy:['alice','bob']}));
  await assertSucceeds(updateDoc(doc(bob,'community_resources','r1'),{upvotes:2,upvotedBy:['alice','bob']}));
  console.log('Firestore rules: 14 permission checks passed');
} finally { await env.cleanup(); }
