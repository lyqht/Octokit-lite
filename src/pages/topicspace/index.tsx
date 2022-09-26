import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import RepositoryPicker, {
  createGroupedOptions,
} from '@/features/topicspace/RepositoryPicker';
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

export default function TopicSpace({ user, repos = [] }: Props) {
  const session = supabaseClient.auth.session();
  const [shownOptions, setShownOptions] = useState<GroupedOption[]>(
    repos ? createGroupedOptions(repos) : [],
  );
  const [topics, setTopics] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState<Option[]>([]);

  const onActionButtonClick = async () => {
    const reposToBeUpdated = selectedRepos
      .map((repo) => `- ${repo.label}<br />`)
      .join(``);
    const userInput = await Popup.fire({
      title: `Are you sure?`,
      html: `You are about to add topics to the following repositories:<br />${reposToBeUpdated}`,
      icon: `warning`,
      showCancelButton: true,
      confirmButtonColor: `#F04444`,
      cancelButtonColor: `#D9D9D9`,
      confirmButtonText: `Yes, confirm.`,
    });

    if (userInput.isConfirmed && session?.provider_token) {
      const res = await fetch(
        `api/github?provider_token=${
          session.provider_token
        }&selectedRepos=${JSON.stringify(
          selectedRepos.map((repo) => repo.value),
        )}&userId=${user?.id}`,
        {
          method: `PUT`,
        },
      );
      const resBody = await res.json();
      const numRepos = resBody.data.length;
      Popup.fire(
        `Added topics!`,
        `${numRepos} repositories has been modified.`,
        `success`,
      );
    }
  };

  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="p-16">
        <BackButton />
        <div className="flex h-full flex-col">
          <div className="flex flex-grow flex-col items-center justify-center p-4">
            <Head>
              <title>TopicSpace</title>
              <meta
                name="description"
                content="App to help add topics to your repos"
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
                    Choose the repositories that you want to add topics to.
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
                    onClick={onActionButtonClick}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-ghost text-xs"
                    onClick={() => {
                      Router.push(`/topicspace/history`);
                    }}
                  >
                    View what you have updated using Octokit-lite
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
    const provider_token = ctx.req.cookies[`sb-provider-token`];
    const { user } = await getUser(ctx);
    const githubResponse = await fetch(
      `${server}/api/github?provider_token=${provider_token}`,
    );
    const { repos }: GetRepositoriesResponse = await githubResponse.json();
    const filteredRepos = repos.filter(repo => `${repo.owner.id}` === user.user_metadata.provider_id)

    return { props: { user, repos: filteredRepos } };
  },
});
