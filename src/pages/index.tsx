import { BasicUserInfo, LoginButton } from '@/components/Auth';
import LoadingIndicator from '@/components/LoadingIndicator';
import RepositoryPicker, {
  createGroupedOptions,
} from '@/components/RepositoryPicker';
import { Auth, Button } from '@supabase/ui';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { GroupedOption, Option } from '../components/RepositoryPicker';
import { GetRepositoriesResponse, DeletedRecord } from './api/github';

const Popup = withReactContent(Swal);

export default function Home() {
  const { user, session } = Auth.useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GetRepositoriesResponse | null>(null);
  const [shownOptions, setShownOptions] = useState<GroupedOption[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<Option[]>([]);

  const [deletedItems, setDeletedItems] = useState<DeletedRecord[]>([]);
  const [showDeletedItems, setShowDeletedItems] = useState(false);

  const fetchAndUpdateData = async () => {
    if (user && session && session.provider_token) {
      try {
        const githubResponse = await fetch(
          `api/github?provider_token=${session.provider_token}`,
        );
        const fetchedData = await githubResponse.json();
        setData(fetchedData);
        setShownOptions(createGroupedOptions(fetchedData.repos));
      } catch (err) {
        Popup.fire({
          icon: `error`,
          title: `Error retrieving data from GitHub API`,
          text: `${err}`,
        });
      }

      try {
        const dbResponse = await fetch(`api/supabase?userId=${user.id}`);
        const fetchedData: DeletedRecord[] = await dbResponse.json();
        setDeletedItems(fetchedData);
      } catch (err) {
        Popup.fire({
          icon: `error`,
          title: `Error retrieving data from DB`,
          text: `${err}`,
        });
      }

      setLoading(false);
    }
  };

  const onDeleteButtonPress = async () => {
    const reposToBeDeletedTextInBulletPoints = selectedRepos
      .map((repo) => `- ${repo.label}<br />`)
      .join(``);
    const userInput = await Popup.fire({
      title: `Are you sure?`,
      html: `You are about to delete the following repositories:<br />${reposToBeDeletedTextInBulletPoints}`,
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
    <div className="h-screen flex flex-col">
      <div className="h-100 flex-col flex-grow flex justify-center items-center p-4">
        <Head>
          <title>Unfork</title>
          <meta
            name="description"
            content="App to help remove all your unused forks"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div
          className={`text-center flex flex-col shrink justify-items-center content-center p-4`}
        >
          <h1 className={`text-slate-700 text-5xl`}>Unfork</h1>
          {user ? <BasicUserInfo /> : <LoginButton />}
        </div>

        {loading && user ? (
          <LoadingIndicator />
        ) : (
          <div className="flex flex-col flex-grow w-full md:w-1/4 flex-auto px-4">
            {!showDeletedItems && data && (
              <div className={`flex flex-col h-full justify-between py-4`}>
                <div>
                  <p>
                    You have a total of{` `}
                    <span className="underline underline-offset-4 text-white bg-slate-500 px-2 rounded-t-lg">
                      {data.repos.length}
                    </span>
                    {` `}
                    repositories.
                  </p>
                  <div className="pb-4">
                    <button
                      className="text-slate-500"
                      onClick={() => {
                        setShowDeletedItems(true);
                      }}
                    >
                      View what you have deleted using Unfork
                    </button>
                  </div>
                  <p className="py-4">
                    Choose the repositories that you want to delete.
                  </p>
                  <RepositoryPicker
                    options={shownOptions}
                    onChange={(selected) => {
                      setSelectedRepos(selected as Option[]);
                      const selectedLabels = selected.map((x) => x.label);
                      const updatedShownRepos = { ...data }.repos.filter(
                        (x) => !selectedLabels.includes(x.name),
                      );
                      setShownOptions(createGroupedOptions(updatedShownRepos));
                    }}
                  />
                </div>
                <Button
                  block
                  size="xlarge"
                  disabled={selectedRepos.length === 0}
                  className="my-8"
                  onClick={onDeleteButtonPress}
                >
                  Delete
                </Button>
              </div>
            )}
            {showDeletedItems && (
              <div>
                <button
                  onClick={() => {
                    setShowDeletedItems(false);
                  }}
                >
                  {`<`} Back
                </button>
                {deletedItems.map((item) => (
                  <div className="flex flex-row" key={item.id}>
                    <p className="p-1">{item.repo}</p>
                    <p className="p-1">Deleted at {item.created_at}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-screen flex flex-col items-center justify-center py-4">
        <div
          id="footer-divider"
          className="w-1/2 border-t border-gray-300 p-2"
        ></div>

        <footer className={`text-slate-800`}>
          <span>
            Project by{` `}
            <a
              href="https://github.com/lyqht"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-slate-500`}
            >
              Estee Tey
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}
