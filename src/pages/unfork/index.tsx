import BackButton from '@/components/BackButton';
import RepositoryPicker, {
  createGroupedOptions,
} from '@/components/RepositoryPicker';
import { server } from '@/config';
import { GetRepositoriesResponse, Repository } from '@/types/github';
import {
  getUser,
  supabaseClient,
  User,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import Head from 'next/head';
import Router from 'next/router';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { GroupedOption, Option } from '../../components/RepositoryPicker';

const Popup = withReactContent(Swal);
interface Props {
  user: User;
  repos: Repository[];
}

export default function Unfork({ user, repos = [] }: Props) {
  const session = supabaseClient.auth.session();
  const [shownOptions, setShownOptions] = useState<GroupedOption[]>(
    repos ? createGroupedOptions(repos) : [],
  );
  const [selectedRepos, setSelectedRepos] = useState<Option[]>([]);

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

    if (userInput.isConfirmed && session?.provider_token) {
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
    }
  };

  return (
    <div className="h-screen p-16">
      <BackButton />
      <div className="flex h-full flex-col">
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
                    {repos.length}
                  </span>
                  {` `}
                  repositories.
                </p>
                <p className="py-4">
                  Choose the repositories that you want to delete.
                </p>
                <RepositoryPicker
                  options={shownOptions}
                  onChange={(selected) => {
                    setSelectedRepos(selected as Option[]);
                    const selectedLabels = selected.map((x) => x.label);
                    const updatedShownRepos = repos.filter(
                      (x) => !selectedLabels.includes(x.name),
                    );
                    setShownOptions(createGroupedOptions(updatedShownRepos));
                  }}
                />
              </div>

              <div className="flex flex-col gap-4">
                <button
                  className="btn btn-outline"
                  disabled={selectedRepos.length === 0}
                  onClick={onDeleteButtonPress}
                >
                  Delete
                </button>
                <button
                  className="btn btn-ghost text-xs"
                  onClick={() => {
                    Router.push(`/unfork/history`);
                  }}
                >
                  View what you have deleted using Unfork
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: `/`,
  async getServerSideProps(ctx) {
    const provider_token = ctx.req.cookies[`sb-provider-token`];
    const { user } = await getUser(ctx);
    const githubResponse = await fetch(
      `${server}/api/github?provider_token=${provider_token}`,
    );
    const { repos }: GetRepositoriesResponse = await githubResponse.json();

    return { props: { user, repos } };
  },
});
