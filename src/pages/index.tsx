import { BasicUserInfo, LoginButton } from '@/components/Auth';
import RepositoryPicker from '@/components/RepositoryPicker';
import styles from '@/styles/Home.module.css';
import { Auth, Button } from '@supabase/ui';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { GetRepositoriesResponse } from './api/github';
import { Option } from '../components/RepositoryPicker';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Popup = withReactContent(Swal);

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

  const onDeleteButtonPress = async () => {
    const description = selectedRepos.map(repo => `- ${repo.label}<br />`).join('');
    const userInput = await Popup.fire({
      title: `Are you sure?`,
      html: `You are about to delete the following repositories:<br />${description}`,
      icon: `warning`,
      showCancelButton: true,
      confirmButtonColor: `#F04444`,
      cancelButtonColor: `#D9D9D9`,
      confirmButtonText: `Yes, confirm delete.`,
    });

    if (userInput.isConfirmed && session) {
      const res = await fetch(
        `api/github?provider_token=${
          session.provider_token
        }&selectedRepos=${JSON.stringify(
          selectedRepos.map((repo) => repo.value),
        )}&userId=${user?.id}`,
        {
          method: `DELETE`,
        },
      );
      const resBody = await res.json();
      const numReposDeleted = resBody.data.length;
      Popup.fire(
        `Deleted!`,
        `${numReposDeleted} repositories has been deleted.`,
        `success`,
      );
      setLoading(true);
      fetchAndUpdateData();
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAndUpdateData();
  }, [session, user]);

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

      <div
        className={`text-center flex-col shrink justify-items-center content-center p-4`}
      >
        <h1 className={'text-slate-700 text-5xl'}>Unfork</h1>
        {user ? <BasicUserInfo /> : <LoginButton />}
      </div>

      <div className={styles.body}>
        {!loading && data && (
          <>
            <div>
              <p>
                You have a total of{' '}
                <span className="underline underline-offset-4 text-white bg-slate-500 px-2 rounded-t-lg">
                  {data.repos.length}
                </span>{' '}
                repositories.
              </p>
              <div className="pb-4">
                <p className="text-slate-500">
                  View what you have deleted using Unfork
                </p>
              </div>
              <p className="py-4">
                Choose the repositories that you want to delete.
              </p>
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
              onClick={onDeleteButtonPress}
            >
              Delete
            </Button>
          </>
        )}
        {loading && (
          <div className={'rounded flex content-center justify-center p-4'}>
          <svg role="status" className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-slate-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
            <p>Fetching your repos...</p>
          </div>
        )}
      </div>

      <div className="w-1/2 border-t border-gray-300 p-2"></div>

      <footer className={'text-slate-800'}>
        <span>
          Project by{` `}
          <a
            href="https://github.com/lyqht"
            target="_blank"
            rel="noopener noreferrer"
            className={'text-slate-500'}
          >
            Estee Tey
          </a>
        </span>
      </footer>
    </div>
  );
}
