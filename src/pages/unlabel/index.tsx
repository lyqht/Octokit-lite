import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import { server } from '@/config';
import RepositoryPicker from '@/features/unlabel/RepositoryPicker';
import LabelPicker, {
  defaultLabelOptions,
} from '@/features/unlabel/LabelPicker';
import { useMultipleSelection } from '@/hooks/useMultipleSelection';
import { GetRepositoriesAndLabelsResponse } from '@/types/github';
import { getUser, User, withPageAuth } from '@supabase/auth-helpers-nextjs';
import Head from 'next/head';
import router from 'next/router';
import Router from 'next/router';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Option, RepoOption } from '@/types/select';

const Popup = withReactContent(Swal);
interface Props {
  user: User;
  providerToken: string;
  labelsAndRepos: GetRepositoriesAndLabelsResponse['labelsAndRepos'];
}

export default function Unlabel({
  user,
  providerToken,
  labelsAndRepos = [],
}: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState<RepoOption[]>([]);
  const [labelInput, setLabelInput] = useState<string>(``);
  const [labels, setLabels] = useState<Option[]>([]);
  const {
    getSelectedItemProps: getSelectedRepoProps,
    getDropdownProps: getRepoDropdownProps,
    removeSelectedItem: removeSelectedRepo,
  } = useMultipleSelection({
    selectedItems: selectedRepos,
    setSelectedItems: setSelectedRepos,
  });

  const {
    getSelectedItemProps: getSelectedLabelsProps,
    getDropdownProps: getLabelDropdownProps,
    removeSelectedItem: removeSelectedLabel,
  } = useMultipleSelection({
    selectedItems: labels,
    setSelectedItems: setLabels,
  });

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const onDeleteButtonPress = async () => {
    const reposToBeUpdatedTextInBulletPoints = selectedRepos
      .map((repo) => `- ${repo.label}<br />`)
      .join(``);
    const userInput = await Popup.fire({
      title: `Are you sure?`,
      html: `You are about to delete the following labels from these repositories:<br />${reposToBeUpdatedTextInBulletPoints}`,
      icon: `warning`,
      showCancelButton: true,
      confirmButtonColor: `#F04444`,
      cancelButtonColor: `#D9D9D9`,
      confirmButtonText: `Yes, confirm update.`,
    });

    if (userInput.isConfirmed && providerToken) {
      setLoading(true);
      const res = await fetch(
        `api/github?provider_token=${providerToken}&repos=${JSON.stringify(
          selectedRepos.map((repo) => repo.value),
        )}&labels=${labels.map(({ value }) => value)}&userId=${user?.id}`,
        {
          method: `PATCH`,
        },
      );
      const resBody = await res.json();
      const numRepos = Object.keys(resBody).length;
      if (res.status === 200)
        Popup.fire(
          `Updated!`,
          `${numRepos} repositories has been updated.`,
          `success`,
        );
      else Popup.fire(`Failure!`, `Something went wrong..`, `error`);
      setLoading(false);
      refreshData();
      setSelectedRepos([]);
    }
  };

  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="p-16">
        <BackButton />
        <div className="flex h-auto flex-col">
          <div className="flex flex-grow flex-col items-center justify-center p-4">
            <Head>
              <title>Unlabel</title>
              <meta
                name="description"
                content="App to help remove all unnecessary labels from your repos"
              />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex w-full flex-auto flex-grow flex-col px-4 lg:w-1/3">
              <div className={`flex h-full flex-col justify-between py-4`}>
                <div className="flex h-1/2 flex-col justify-center">
                  <p>
                    You have a total of{` `}
                    <span className="rounded-t-lg bg-slate-500 px-2 text-white underline underline-offset-4">
                      {labelsAndRepos.length}
                    </span>
                    {` `}
                    repositories.
                  </p>
                  <div id="Label-selection-container" className="py-4">
                    <p className="label py-4">
                      Enter the label(s) to be removed.
                    </p>
                    <LabelPicker
                      options={defaultLabelOptions}
                      getSelectedItemProps={getSelectedLabelsProps}
                      getDropdownProps={getLabelDropdownProps}
                      removeSelectedItem={removeSelectedLabel}
                      selectedItems={labels}
                      setSelectedItems={setLabels}
                      inputValue={labelInput}
                      setInputValue={setLabelInput}
                    />
                  </div>
                  <div id="repository-selection-container" className="py-4">
                    <p className="label py-4">
                      Choose the repositories to remove labels from.
                    </p>
                    <RepositoryPicker
                      data={labelsAndRepos}
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
                    disabled={selectedRepos.length === 0}
                    onClick={onDeleteButtonPress}
                  >
                    Next →
                  </button>
                  <button
                    className="btn btn-ghost text-xs"
                    onClick={() => {
                      Router.push(`/unlabel/history`);
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
    const labelsFromReposResponse = await fetch(
      `${server}/api/github?provider_token=${providerToken}&labels='true`,
    );

    const { labelsAndRepos }: GetRepositoriesAndLabelsResponse =
      await labelsFromReposResponse.json();

    const filteredRepos = labelsAndRepos.filter(
      ({ repo }) => `${repo.owner.id}` === user.user_metadata.provider_id,
    );

    return { props: { user, providerToken, labelsAndRepos: filteredRepos } };
  },
});
