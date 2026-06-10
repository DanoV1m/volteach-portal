import { Institution } from '../types';

export const institutions: Institution[] = [
  {
    key: 'technion',
    name: 'הטכניון',
    fullName: 'הטכניון — מכון טכנולוגי לישראל',
    location: 'חיפה',
    emoji: '🏛️',
    type: 'uni',
    moodleUrl: 'https://moodle.technion.ac.il/',
    driveId: '1F7xpIPzW6VXoLLlBzPHRBQ5-oruc7jiR',
    programs: ['הנדסת חשמל ומחשבים', 'אלקטרוניקה', 'תקשורת', 'בקרה ורובוטיקה']
  },
  {
    key: 'tau',
    name: 'אוניברסיטת תל אביב',
    fullName: 'אוניברסיטת תל אביב',
    location: 'תל אביב',
    emoji: '🎓',
    type: 'uni',
    moodleUrl: 'https://moodle.tau.ac.il/',
    driveId: '1FL9P_pdFTzEG9JRjndk44DI9ienrkifM',
    programs: ['הנדסת חשמל', 'אלקטרוניקה ורכיבים', 'עיבוד אותות', 'תקשורת']
  },
  {
    key: 'bgu',
    name: 'אוניברסיטת בן-גוריון',
    fullName: 'אוניברסיטת בן-גוריון בנגב',
    location: 'באר שבע',
    emoji: '🌵',
    type: 'uni',
    moodleUrl: 'https://moodle.bgu.ac.il/',
    driveId: '1F2Zm0XhOuTgudOUteotS3SakalgsKxJN',
    programs: ['הנדסת חשמל', 'תקשורת', 'אנרגיה מתחדשת', 'רובוטיקה']
  },
  {
    key: 'biu',
    name: 'אוניברסיטת בר-אילן',
    fullName: 'אוניברסיטת בר-אילן',
    location: 'רמת גן',
    emoji: '📚',
    type: 'uni',
    moodleUrl: 'https://moodle.biu.ac.il/',
    driveId: '1F0rOw9thY7IptbFl5iwJrGMyzWCgvZie',
    programs: ['הנדסת חשמל', 'ננוטכנולוגיה', 'אלקטרואופטיקה']
  },
  {
    key: 'huji',
    name: 'האוניברסיטה העברית',
    fullName: 'האוניברסיטה העברית בירושלים',
    location: 'ירושלים',
    emoji: '🏫',
    type: 'uni',
    moodleUrl: 'https://moodle.huji.ac.il/',
    driveId: '1F5zTTkgJgz-dAW2XDnwPkjUvXd0lT56q',
    programs: ['הנדסת חשמל', 'אלקטרואופטיקה', 'מערכות מוטמעות']
  },
  {
    key: 'ariel',
    name: 'אוניברסיטת אריאל',
    fullName: 'אוניברסיטת אריאל בשומרון',
    location: 'אריאל',
    emoji: '🏔️',
    type: 'uni',
    moodleUrl: 'https://moodle.ariel.ac.il/',
    driveId: '1-bbhEytfYY-YxiBHrt1gjB4uZV4SriPa',
    programs: ['הנדסת חשמל', 'אלקטרוניקה', 'מחשבים ותקשורת']
  },
  {
    key: 'afeka',
    name: 'מכללת אפקה',
    fullName: 'מכללת אפקה — תל אביב',
    location: 'תל אביב',
    emoji: '🔌',
    type: 'college',
    moodleUrl: 'https://moodle.afeka.ac.il/',
    driveId: '1F8d_ef_QYGjB9hubUQ_wzM6ceKOJEM8g',
    programs: ['הנדסת חשמל', 'אלקטרוניקה', 'תוכנה', 'מחשבים']
  },
  {
    key: 'hit',
    name: 'HIT — הולון',
    fullName: 'HIT — המכון הטכנולוגי חולון',
    location: 'הולון',
    emoji: '⚡',
    type: 'college',
    moodleUrl: 'https://moodle.hit.ac.il/',
    driveId: '1F8-8W7f9EtV8QxA_fpZIguU9CLfvHM-C',
    programs: ['הנדסת חשמל', 'מחשבים', 'ביוטכנולוגיה']
  },
  {
    key: 'shamoon',
    name: 'מכללת סמי שמעון',
    fullName: 'מכללת סמי שמעון (SCE)',
    location: 'באר שבע / אשדוד',
    emoji: '🏗️',
    type: 'college',
    moodleUrl: 'https://moodle.shamoon.ac.il/',
    driveId: '1FQCPDoAXLxgyxy4i7ArYeNoXHqMNEthP',
    programs: ['הנדסת חשמל ואלקטרוניקה', 'תוכנה', 'בקרה']
  },
  {
    key: 'braude',
    name: 'מכללת בראודה',
    fullName: 'מכללת בראודה — כרמיאל',
    location: 'כרמיאל',
    emoji: '🔬',
    type: 'college',
    moodleUrl: 'https://moodle.braude.ac.il/',
    driveId: '1FB-DJeuhXgF_k-wzFPv2PRQlKBY5j2y3',
    programs: ['הנדסת חשמל ואלקטרוניקה', 'מחשבים ורשתות', 'אוטומציה']
  },
  {
    key: 'jce',
    name: 'עזריאלי ירושלים',
    fullName: 'המכללה האקדמית עזריאלי — ירושלים',
    location: 'ירושלים',
    emoji: '🕊️',
    type: 'college',
    moodleUrl: 'https://moodle.jce.ac.il/',
    driveId: '1FPdTmbv5TYACqMwz9b8xrNcJ52bZVete',
    programs: ['הנדסת חשמל', 'אלקטרוניקה', 'תוכנה']
  },
  {
    key: 'ruppin',
    name: 'המרכז האקדמי רופין',
    fullName: 'המרכז האקדמי רופין',
    location: 'עמק חפר',
    emoji: '🌾',
    type: 'college',
    moodleUrl: 'https://moodle.ruppin.ac.il/',
    driveId: '1FDVJZWl99sl8EHr2V7Pn1FJLNdQH8RUK',
    programs: ['הנדסת חשמל', 'אלקטרוניקה', 'מערכות מחשב']
  },
  {
    key: 'kinneret',
    name: 'המכללה האקדמית כנרת',
    fullName: 'המכללה האקדמית כנרת',
    location: 'צמח',
    emoji: '🌊',
    type: 'college',
    moodleUrl: 'https://moodle.kinneret.ac.il/',
    driveId: '1FUOueWDW13EFjWJz3FOqehln9cpQvGwC',
    programs: ['הנדסת חשמל', 'הנדסת תוכנה', 'מחשבים']
  },
  {
    key: 'lev',
    name: 'המרכז האקדמי לב',
    fullName: 'המרכז האקדמי לב — ירושלים (JCT)',
    location: 'ירושלים',
    emoji: '✡️',
    type: 'college',
    moodleUrl: 'https://moodle.jct.ac.il/',
    driveId: '1FQtaRjM6EFmzX5W4W2JHk7t4qtyNgB9z',
    programs: ['הנדסת חשמל', 'מחשבים', 'תוכנה']
  }
];
