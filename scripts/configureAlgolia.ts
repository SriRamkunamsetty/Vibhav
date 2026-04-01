const algoliasearch = require('algoliasearch');
require('dotenv').config();

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
const PRIMARY_INDEX = 'products';

if (!APP_ID || !ADMIN_KEY) {
  console.error('❌ Missing Algolia Credentials in .env');
  process.exit(1);
}

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex(PRIMARY_INDEX);

const REPLICAS = [
  'products_price_asc',
  'products_price_desc',
  'products_newest'
];

async function configure() {
  console.log('🚀 Configuring Primary Index: products...');

  // 1. SET PRIMARY SETTINGS & DEFINE REPLICAS
  await index.setSettings({
    searchableAttributes: [
      'unordered(name)',
      'unordered(category)',
      'unordered(description)'
    ],
    attributesForFaceting: [
      'category',
      'numeric(price)',
      'numeric(rating)'
    ],
    customRanking: [
      'desc(featured)',
      'desc(rating)',
      'desc(updatedAt)'
    ],
    replicas: REPLICAS
  }).wait();

  console.log('✅ Primary Index Configured. Initializing Replicas...');

  // 2. CONFIGURE REPLICAS
  const replicaConfigs = [
    {
      name: 'products_price_asc',
      settings: { ranking: ['asc(price)', 'typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'] }
    },
    {
      name: 'products_price_desc',
      settings: { ranking: ['desc(price)', 'typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'] }
    },
    {
      name: 'products_newest',
      settings: { ranking: ['desc(updatedAt)', 'typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'] }
    }
  ];

  for (const replica of replicaConfigs) {
    const replicaIndex = client.initIndex(replica.name);
    await replicaIndex.setSettings(replica.settings).wait();
    console.log(`✅ Replica Configured: ${replica.name}`);
  }

  console.log('🏁 All Search Indices are 100% Production-Ready.');
}

configure().catch(console.error);
