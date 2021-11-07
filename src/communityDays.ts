// Node modules.
import _ from 'lodash';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import urlJoin from 'url-join';
// Local modules.
import { hostUrl } from './utils';

interface CommunityDay {
  featuredPokemon?: string;
  eligiblePokemon?: string;
  moves?: string[];
  date?: string;
}

const getCommunityDays = async () => {
  const wikiUrl = urlJoin(hostUrl, `/wiki/Community_Day`);
  const res = await fetch(wikiUrl);
  const xml = await res.text();

  const root = parse(xml);
  const rowItems = root.querySelectorAll('table.roundtable tbody tr');

  const communityDays: CommunityDay[] = [];
  
  for await (const rowItem of rowItems) {
    const tdItems = rowItem.querySelectorAll('td');
    const isHeader = !tdItems.length;

    if (isHeader) {
      continue;
    }

    // First row.
    if (tdItems.length === 6) {
      const featuredPokemon = tdItems[0].querySelector('a')?.getAttribute('title');
      const date = tdItems[1].getAttribute('data-sort-value');
      const moves = tdItems[2].querySelectorAll('a')?.map(e => e.getAttribute('title')!).filter(s => s?.includes('(move)')).map(s => s?.replace(' (move)', ''));
      const eligiblePokemons = tdItems[3].querySelectorAll('span a')?.map(e => e.getAttribute('title'));

      eligiblePokemons.forEach(eligiblePokemon => communityDays.push({ featuredPokemon, eligiblePokemon, moves, date }));
    }
    // Second row, third row ...
    else if (tdItems.length === 2) {
      const moves = tdItems[0].querySelectorAll('a')?.map(e => e.getAttribute('title')!).filter(s => s?.includes('(move)')).map(s => s?.replace(' (move)', ''));
      const eligiblePokemon = tdItems[1].querySelector('a')?.getAttribute('title');
      const lastCommunityDay = _.last(communityDays);

      communityDays.push({ ...lastCommunityDay, eligiblePokemon, moves });
    }
  }

  return communityDays.filter(c => c.featuredPokemon);
};

export {
  getCommunityDays,
};
