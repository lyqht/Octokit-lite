import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import { server } from '@/config';
import RepositoryPicker from '@/features/topicspace/RepositoryPicker';
import { useMultipleSelection } from '@/hooks/useMultipleSelection';
import { GetRepositoriesResponse, Repository } from '@/types/github';
import { Option, RepoOption } from '@/types/select';
import { getUser, User, withPageAuth } from '@supabase/auth-helpers-nextjs';
import Head from 'next/head';
import Router from 'next/router';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { UpdateRepositoryResponse } from '../../types/github';
import TopicPicker, {
  defaultTopicOptions,
} from '../../features/topicspace/TopicPicker';
import router from 'next/router';

const Popup = withReactContent(Swal);
interface Props {
  user: User;
  providerToken: string;
  repos: Repository[];
}

export default function TopicSpace({ user, providerToken, repos = [] }: Props) {
  const [loading, setLoading] = useState(false);
  const [topicInput, setTopicInput] = useState<string>(``);
  const [topics, setTopics] = useState<Option[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<RepoOption[]>([]);

  const {
    getSelectedItemProps: getSelectedRepoProps,
    getDropdownProps: getRepoDropdownProps,
    removeSelectedItem: removeSelectedRepo,
  } = useMultipleSelection({
    selectedItems: selectedRepos,
    setSelectedItems: setSelectedRepos,
  });

  const {
    getSelectedItemProps: getSelectedTopicsProps,
    getDropdownProps: getTopicDropdownProps,
    removeSelectedItem: removeSelectedTopic,
  } = useMultipleSelection({
    selectedItems: topics,
    setSelectedItems: setTopics,
  });

  const refreshData = () => {
    router.replace(router.asPath);
  };

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

    if (userInput.isConfirmed && providerToken) {
      setLoading(true);
      const res = await fetch(
        `api/github?provider_token=${providerToken}&repos=${JSON.stringify(
          selectedRepos.map((repo) => repo.value),
        )}&topics=${JSON.stringify(
          topics.map((topic) => topic.value),
        )}&userId=${user?.id}`,
        {
          method: `PATCH`,
        },
      );
      const data: UpdateRepositoryResponse = await res.json();
      const numRepos = Object.keys(data).length;
      Popup.fire(
        `Added topics!`,
        `${numRepos} repositories has been modified.`,
        `success`,
      );
    }

    setLoading(false);
    refreshData();
  };

  return (
    <div className="flex h-screen flex-col justify-between">
      <div>
        <div className="m-4">
          <BackButton />
        </div>
        <div className="flex h-auto flex-col">
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
                  <div id="topic-selection-container" className="py-4">
                    <p className="label py-4">
                      Enter the topic(s) to be added.
                    </p>
                    <TopicPicker
                      options={defaultTopicOptions}
                      getSelectedItemProps={getSelectedTopicsProps}
                      getDropdownProps={getTopicDropdownProps}
                      removeSelectedItem={removeSelectedTopic}
                      selectedItems={topics}
                      setSelectedItems={setTopics}
                      inputValue={topicInput}
                      setInputValue={setTopicInput}
                    />
                  </div>
                  <div id="repository-selection-container" className="py-4">
                    <p className="label py-4">
                      Choose the repositories to add topics to.
                    </p>
                    <RepositoryPicker
                      data={repos}
                      getSelectedItemProps={getSelectedRepoProps}
                      getDropdownProps={getRepoDropdownProps}
                      removeSelectedItem={removeSelectedRepo}
                      selectedItems={selectedRepos}
                      setSelectedItems={setSelectedRepos}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <button
                    className={`btn btn-outline ${
                      loading ? `loading before:order-2 before:ml-2` : ``
                    }`}
                    disabled={selectedRepos.length === 0 && topics.length === 0}
                    onClick={onActionButtonClick}
                  >
                    Next →
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
    const providerToken = ctx.req.cookies[`sb-provider-token`];
    const { user } = await getUser(ctx);
    const githubResponse = await fetch(
      `${server}/api/github?provider_token=${providerToken}`,
    );
    const { repos }: GetRepositoriesResponse = await githubResponse.json();
    const filteredRepos = repos.filter(
      (repo) => `${repo.owner.id}` === user.user_metadata.provider_id,
    );

    return {
      props: { user, providerToken, repos: filteredRepos },
    };
  },
});
