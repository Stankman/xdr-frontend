import { Injectable, signal } from '@angular/core';
import type { AcpTableRow } from './ui/acp-table.component';

export interface AcpDemoRecord {
  id: string;
  values: Readonly<Record<string, string>>;
  collections: Readonly<Record<string, readonly { text: string; link?: string[] }[]>>;
}

interface AcpDemoList {
  columns: readonly string[];
  rows: AcpTableRow[];
  records: readonly AcpDemoRecord[];
}

const players: AcpDemoRecord[] = Array.from({ length: 24 }, (_, index) => {
  const id = String(index + 1);
  return {
    id,
    values: {
      'ACP.ID': id,
      'ACP.AVATAR_NAME': `DemoPlayer${id.padStart(2, '0')}`,
      'ACP.RANK': index === 0 ? 'Demo moderator' : 'Demo member',
      'ACP.CREATED_AT': `2026-01-${id.padStart(2, '0')}`,
      'ACP.ACCOUNT': `demo${id}@example.invalid`,
      'ACP.ROOM_COUNT': '1',
      'ACP.BADGE_COUNT': String(index % 5)
    },
    collections: {
      Currencies: [{ text: `Demo credits: ${100 + index * 10}` }],
      'ACP.CHATLOGS': [{ text: '2026-02-01 12:00 UTC | DemoPlayer' + id.padStart(2, '0') + ': Hello, demo hotel!' }]
    }
  };
});

const rooms: AcpDemoRecord[] = players.map((player, index) => ({
  id: player.id,
  values: {
    'ACP.ID': player.id,
    'ACP.NAME': `Demo room ${player.id.padStart(2, '0')}`,
    'ACP.OWNER': player.values['ACP.AVATAR_NAME'],
    'ACP.PRIVACY': index % 2 === 0 ? 'Demo public' : 'Demo password protected',
    'ACP.RATING': '1'
  },
  collections: {
    'ACP.RATERS': [{ text: 'DemoPlayer01', link: ['/acp/players', '1'] }],
    'ACP.VISITOR_LOGS': [{ text: '2026-02-01 12:00 UTC | DemoPlayer01 visited' }],
    'ACP.CHATLOGS': [{ text: '2026-02-01 12:00 UTC | DemoPlayer01: Welcome to this demo room!' }],
    'ACP.ROOM_WORDFILTER': [{ text: 'Demo-only filter: demo-blocked-word' }],
    'ACP.RIGHTS': [{ text: player.values['ACP.AVATAR_NAME'], link: ['/acp/players', player.id] }],
    'ACP.MUTED_USERS': [],
    'ACP.ROOM_BANS': [],
    'ACP.EVENT_HISTORY': [{ text: '2026-02-01 11:00 UTC | Demo room created' }]
  }
}));

const pages: AcpDemoRecord[] = [
  {
    id: '1',
    values: { 'ACP.ID': '1', 'ACP.NAME': 'Demo collection', hidden: 'false' },
    collections: {
      'ACP.CHILD_PAGES': [{ text: 'Demo seating', link: ['/acp/catalog/pages', '2'] }],
      'ACP.OFFERS': [{ text: 'Demo chair offer | Demo chair', link: ['/acp/catalog/furniture', '1'] }]
    }
  },
  {
    id: '2',
    values: { 'ACP.ID': '2', 'ACP.NAME': 'Demo seating', hidden: 'false' },
    collections: {
      'ACP.CHILD_PAGES': [],
      'ACP.OFFERS': [{ text: 'Demo chair offer | Demo chair', link: ['/acp/catalog/furniture', '1'] }]
    }
  },
  {
    id: '3',
    values: { 'ACP.ID': '3', 'ACP.NAME': 'Demo hidden page', hidden: 'true' },
    collections: { 'ACP.CHILD_PAGES': [], 'ACP.OFFERS': [] }
  }
];

const furniture: AcpDemoRecord[] = [{
  id: '1',
  values: { 'ACP.ID': '1', 'ACP.NAME': 'Demo chair', 'ACP.LOGIC': 'Demo seating logic' },
  collections: {
    'ACP.ALL_RECORD_DATA': [{ text: 'ID: 1 | Demo chair | Demo seating logic' }],
    'ACP.ASSOCIATED_OFFER': [{ text: 'Demo chair offer' }],
    'Catalog Pages': [
      { text: 'Demo collection', link: ['/acp/catalog/pages', '1'] },
      { text: 'Demo seating', link: ['/acp/catalog/pages', '2'] }
    ]
  }
}];

function createList(path: string, columns: readonly string[], records: readonly AcpDemoRecord[]): AcpDemoList {
  return {
    columns, records,
    rows: records.map(record => ({
      id: record.id,
      cells: columns.map(column => record.values[column]),
      link: ['/acp', ...path.split('/'), record.id]
    }))
  };
}

const lists: Readonly<Record<string, AcpDemoList>> = {
  players: createList('players', ['ACP.ID', 'ACP.AVATAR_NAME', 'ACP.RANK', 'ACP.CREATED_AT'], players),
  rooms: createList('rooms', ['ACP.ID', 'ACP.NAME', 'ACP.OWNER', 'ACP.PRIVACY'], rooms),
  'catalog/pages': createList('catalog/pages', ['ACP.ID', 'ACP.NAME', 'hidden'], pages),
  'catalog/furniture': createList('catalog/furniture', ['ACP.ID', 'ACP.NAME', 'ACP.LOGIC'], furniture)
};

@Injectable({ providedIn: 'root' })
export class AcpDemoService {
  readonly enabled = signal(false);

  toggle(): void { this.enabled.update(enabled => !enabled); }

  list(path: string): AcpDemoList | undefined {
    return this.enabled() ? lists[path] : undefined;
  }

  record(path: string, id: string | null): AcpDemoRecord | undefined {
    return this.list(path)?.records.find(record => record.id === id);
  }
}
