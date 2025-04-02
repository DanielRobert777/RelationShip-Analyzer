import Head from 'next/head';
import dynamic from 'next/dynamic';

const RelationshipGraph = dynamic(() => import('../components/RelationshipGraph'), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Relationship Graph MVP</title>
      </Head>
      <div style={{ width: '100vw', height: '100vh' }}>
        <RelationshipGraph />
      </div>
    </>
  );
}
