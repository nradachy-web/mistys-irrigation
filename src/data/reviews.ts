/* Google reviews, word for word, read from the Google listing on 2026-11-10.
   Spelling is left as written. Names are first name and last initial. Only the
   three reviews Google shows without a sign-in are here; add more as they are
   read (Misty can send them, or read them while signed in).

   Nothing on the site says "every review is five stars". */

import type { ServiceId } from './services';

export interface Review {
  id: string;
  name: string;
  text: string;
  /** What the job was, in the review's own terms. */
  job: string;
  when: string;
  services: ServiceId[];
}

export const REVIEWS: Review[] = [
  {
    id: 'zachary-b', name: 'Zachary B.', job: 'Repair and inspection', when: 'October 2026',
    services: ['sprinkler-repair', 'startup', 'head-replacement'],
    text: 'Misty’s Irrigation came out to repair and inspect our lawn irrigation system and did a great job. Very knowledgeable, professional, and just great people to work with. It’s always nice being able to support a local Fenton business, especially when they provide this kind of service. Highly recommend!',
  },
  {
    id: 'susan-r', name: 'Susan R.', job: 'Service call, two heads replaced', when: 'July 2026',
    services: ['head-replacement', 'sprinkler-repair'],
    text: 'Quick to respond to phone message. Scheduled service call and took great care of my sprinkler system, replacing 2 sprinkler heads and checked all of the others. I highly recommended this company for their services',
  },
  {
    id: 'joe-s', name: 'Joe S.', job: 'Repair work', when: 'May 2026',
    services: ['sprinkler-repair', 'valve-repair'],
    text: 'Misty’s did some repair work at a fair price. Staff was very pleasant, on time and cleaned up well in addition to excellent communication. Will use them in the future for any sprinkler system needs without it a doubt!',
  },
];

export const review = (id: string) => REVIEWS.find((r) => r.id === id);
