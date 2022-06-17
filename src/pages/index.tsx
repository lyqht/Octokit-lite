import { BasicUserInfo, LoginButton } from '@/components/Auth';
import RepositoryPicker from '@/components/RepositoryPicker';
import styles from '@/styles/Home.module.css';
import { Auth, Button } from '@supabase/ui';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { GetRepositoriesResponse } from './api/github';
import { Option } from '../components/RepositoryPicker';

export default function Home() {
  const { user, session } = Auth.useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GetRepositoriesResponse | null>(null);
  const [selectedRepos, setSelectedRepos] = useState<Option[]>([]);

  const fetchAndUpdateData = () => {
    if (session && session.provider_token) {
      fetch(`api/github?provider_token=${session.provider_token}`, {
        method: `GET`,
      })
        .then((res) => res.json())
        .then((fetchedData) => {
          setData(fetchedData);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAndUpdateData();
  }, [session]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Unfork</title>
        <meta
          name="description"
          content="App to help remove all your unused forks"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={user ? styles[`main-loggedin`] : styles.main}>
        <h1 className={styles.title}>Unfork</h1>
        {user ? <BasicUserInfo /> : <LoginButton />}
      </main>

      <div className={styles.main}>
        {!loading && data && (
          <>
            <div>
              <h3>You have a total of {data.repos.length} repositories.</h3>
              <p>Choose the repositories that you want to delete.</p>
              <div className={styles.select}>
                <RepositoryPicker
                  options={[
                    {
                      label: `Forked`,
                      options: data.forks.map((repo) => ({
                        value: { owner: repo.owner.login, repo: repo.name },
                        label: repo.name,
                      })),
                    },
                    {
                      label: `Original`,
                      options: data.notForks.map((repo) => ({
                        value: { owner: repo.owner.login, repo: repo.name },
                        label: repo.name,
                      })),
                    },
                  ]}
                  onChange={setSelectedRepos}
                />
              </div>
            </div>
            <Button
              block
              size="xlarge"
              disabled={selectedRepos.length === 0}
              onClick={() => {
                if (session) {
                  fetch(
                    `api/github?provider_token=${
                      session.provider_token
                    }&selectedRepos=${JSON.stringify(
                      selectedRepos.map((repo) => repo.value),
                    )}`,
                    {
                      method: `DELETE`,
                    },
                  ).then((res) => {
                    console.log(res);
                    setLoading(true);
                    fetchAndUpdateData();
                  });
                }
              }}
            >
              Delete
            </Button>
          </>
        )}
      </div>

      <footer className={styles.footer}>
        <span>
          Project by{` `}
          <a
            href="https://github.com/lyqht"
            target="_blank"
            rel="noopener noreferrer"
          >
            Estee Tey
          </a>
        </span>
      </footer>
    </div>
  );
}
