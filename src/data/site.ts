/* Every business fact in one place. A page never types a phone number, a rating
   or a link: it reads them from here. Sources are in docs/FACTS.md. */

export const BRAND = {
  name: "Misty's Irrigation",
  /** The logo's own line. */
  tagline: 'Irrigation Services',
  owners: 'Misty and Mike Lutz',
  phone: '(810) 423-9513',
  phoneHref: 'tel:+18104239513',
  smsHref: 'sms:+18104239513',
  phoneE164: '+18104239513',
  email: 'mistysirr@gmail.com',
  /* A service area business: no street address is printed. */
  city: 'Fenton',
  state: 'MI',
  region: 'Fenton, Grand Blanc, Holly and Livingston County',
  origin: 'https://mistysirr.com',
};

/* Read from the Google listing on 2026-11-10. Re-read before quoting. */
export const RATING = {
  value: '5.0',
  count: 40,
  countLabel: '40',
  asOf: '2026-11-10',
};

/* What reviewers mention most, as Google's own review topics counted them on 2026-11-10. */
export const REVIEW_TOPICS = [
  { name: 'Promptness', count: 6 },
  { name: 'Reasonable pricing', count: 5 },
  { name: 'Sprinkler repair', count: 3 },
  { name: 'Winterization', count: 3 },
  { name: 'Leak repair', count: 2 },
  { name: 'Hardworking staff', count: 2 },
];

export const LINKS = {
  google: "https://www.google.com/maps/place/Misty's+Irrigation/data=!4m2!3m1!1s0xa85be5c895d6b3af:0xbce364208999943e",
  googleReview: 'https://search.google.com/local/writereview?placeid=',
  facebook: 'https://www.facebook.com/people/Mistys-Irrigation-Service-Repair/100089881842074/',
};

export const SOCIAL = [
  { name: 'Google', href: LINKS.google },
  { name: 'Facebook', href: LINKS.facebook },
].filter((s) => s.href);

export const FORM = {
  /* Web3Forms key. Empty until the form is created and a real test arrives: an
     empty key shows the phone number instead of pretending to send. */
  key: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',
  endpoint: 'https://api.web3forms.com/submit',
};

export const TRACKING = {
  /* The GA4 property on the old site, kept so history carries over. Ownership to confirm. */
  ga4: 'G-X7PD3NW0LX',
  host: 'mistysirr.com',
};

/* The working season, for the season clock and the booking wording. Months are 1 to 12.
   Startups run once hard freezes are done; blowouts run before the ground freezes. */
export const SEASON = {
  startup: { from: [4, 10], to: [5, 31] },
  watering: { from: [6, 1], to: [8, 31] },
  shutdown: { from: [9, 25], to: [11, 15] },
};
