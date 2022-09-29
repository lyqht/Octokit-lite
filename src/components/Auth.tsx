import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

export const BasicUserInfo = ({ user }: { user: User }) => {
  return (
    <div className="grid place-items-center">
      <p className="prose-sm mb-4">
        Signed in: {user.user_metadata.preferred_username || user.email}
      </p>
      <button
        className="btn bg-slate-700"
        onClick={async () => await supabaseClient.auth.signOut()}
      >
        Sign out
      </button>
    </div>
  );
};

export const signInGitHub = async () => {
  await supabaseClient.auth.signIn(
    { provider: `github` },
    { redirectTo: window.location.origin, scopes: `delete_repo, repo` },
  );
};
