import Head from 'next/head';
import Image from 'next/image';
import { BasicUserInfo, LoginButton } from '@/components/Auth';
import styles from '@/styles/Home.module.css';
import { Auth } from '@supabase/ui';
import { useEffect, useState } from 'react';
import { GetRepositoriesResponse, Repository } from './api/github';
import RepositoryItem from '@/components/RepositoryItem';

export default function Home() {
  const { user, session } = Auth.useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GetRepositoriesResponse | null>(null);

  useEffect(() => {
    setLoading(true);
    if (session && session.provider_token) {
      fetch(`api/github?provider_token=${session.provider_token}`)
        .then((res) => res.json())
        .then((fetchedData) => {
          setData(fetchedData);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  return (
    <div className={styles.container}>
      <Head>
        <title>TypeScript starter for Next.js</title>
        <meta
          name="description"
          content="TypeScript starter for Next.js that includes all you need to build amazing apps"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Unfork</h1>
        {user ? <BasicUserInfo /> : <LoginButton />}
      </main>

      <body className={styles.main}>
        {!loading && data && (
          <div>
            <p>
              You have {data.repos.length} repositories, out of which{` `}
              {data.forks.length} are forks.
            </p>
            {data.repos.map((repo) => (
              <RepositoryItem key={repo.id} repository={repo as Repository} />
            ))}
          </div>
        )}
      </body>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=typescript-nextjs-starter"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{` `}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
