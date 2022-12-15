import BackButton from '@/components/BackButton';
import FaqButton from '@/components/FaqButton';
import Footer from '@/components/Footer';
import { server } from '@/config';
import FaqContent from '@/features/unfork/FaqContent';
import RepositoryPicker from '@/features/unfork/RepositoryPicker';
import { useMultipleSelection } from '@/hooks/useMultipleSelection';
import { GetRepositoriesResponse, Repository } from '@/types/github';
import { getUser, User, withPageAuth } from '@supabase/auth-helpers-nextjs';
import Head from 'next/head';
import router from 'next/router';
import Router from 'next/router';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { RepoOption } from '../../types/select';
import { splitArrayInChunks } from '@/utils/splitArrayInChunks'

const Popup = withReactContent(Swal);
const NUMBER_OF_REPOS_PER_CHUNK = 5
interface Props {
  user: User;
  providerToken: string;
  repos: Repository[];
}

export default function Unfork({ user, providerToken, repos = [] }: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<RepoOption[]>([]);
  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      setSelectedItems,
    });

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const onDeleteButtonPress = async () => {
    const reposToBeDeletedTextInBulletPoints = selectedItems
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

    if (userInput.isConfirmed && providerToken) {
      setLoading(true);

      // Split the total of repos into smaller chunks to process
      const reposInChunks = splitArrayInChunks(selectedItems, NUMBER_OF_REPOS_PER_CHUNK);

      let counter = 0;
      let totalNumReposDeleted = 0;
      while (counter < reposInChunks.length) {
        const res = await fetch(
          `api/github?provider_token=${providerToken}&repos=${JSON.stringify(
            reposInChunks[counter].map((repo: { value: string }) => repo.value),
          )}&userId=${user?.id}`,
          {
            method: `DELETE`,
          },
        );

        // Handle error if response is outside the range 200 - 299
        if (!res.ok) {
          const message = `An error has occured: ${res.status}`;
          Popup.fire(message);
          throw new Error(message);
        }

        const resBody = await res.json();
        totalNumReposDeleted += resBody.data.length;
        counter++;
      }

      Popup.fire(
        `Deleted!`,
        `${totalNumReposDeleted} repositories has been deleted.`,
        `success`,
      );
      setLoading(false);
      refreshData();
      setSelectedItems([]);
    }
  };

  return (
    <div className="relative flex h-screen flex-col justify-between">
      <div className="p-16">
        <div className="flex flex-row justify-between">
          <BackButton />
          <FaqButton content={FaqContent} />
        </div>
        <div className="flex h-auto flex-col">
          <div className="flex flex-grow flex-col items-center justify-center p-4">
            <Head>
              <title>Unfork</title>
              <meta
                name="description"
                content="App to help remove all your unused forks"
              />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex w-full flex-auto flex-grow flex-col px-4 lg:w-1/3">
              <div className={`flex h-full flex-col justify-between py-4`}>
                <div className="flex h-1/2 flex-col justify-center">
                  <p>
                    You have a total of{` `}
                    <span className="rounded-t-lg bg-slate-500 px-2 text-white underline underline-offset-4">
                      {loading ? `...` : repos.length}
                    </span>
                    {` `}
                    repositories.
                  </p>
                  <p className="py-4">
                    Choose the repositories that you want to delete.
                  </p>
                  <RepositoryPicker
                    data={repos}
                    getSelectedItemProps={getSelectedItemProps}
                    getDropdownProps={getDropdownProps}
                    removeSelectedItem={removeSelectedItem}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <button
                    className={`btn btn-outline my-16 ${
                      loading ? `loading before:order-2 before:ml-2` : ``
                    }`}
                    disabled={selectedItems.length === 0}
                    onClick={onDeleteButtonPress}
                  >
                    Next →
                  </button>
                  <button
                    className="btn btn-ghost text-xs"
                    onClick={() => {
                      Router.push(`/unfork/history`);
                    }}
                  >
                    View what you have deleted using Octokit-lite
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: `/`,
  async getServerSideProps(ctx) {
    const providerToken = ctx.req.cookies[`sb-provider-token`];
    const { user } = await getUser(ctx);
    const githubResponse = await fetch(
      `${server}/api/github?provider_token=${providerToken}`,
    );
    const { repos }: GetRepositoriesResponse = await githubResponse.json();
    const filteredRepos = repos.filter(
      (repo) => `${repo.owner.id}` === user.user_metadata.provider_id,
    );

    return { props: { user, providerToken, repos: filteredRepos } };
  },
});
