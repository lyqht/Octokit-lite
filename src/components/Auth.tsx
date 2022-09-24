import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

export const BasicUserInfo = ({ user }: { user: User }) => {
  return (
    <div className="grid place-items-center">
      <p className="prose-sm mb-4">
        Signed in: {user.user_metadata.preferred_username || user.email}
      </p>
      <button
        className="btn btn-secondary"
        onClick={() => supabaseClient.auth.signOut()}
      >
        Sign out
      </button>
    </div>
  );
};

export const LoginButton = () => (
  <button
    className="btn btn-primary"
    onClick={() =>
      supabaseClient.auth.signIn(
        { provider: `github` },
        { redirectTo: window.location.origin, scopes: `delete_repo, repo` },
      )
    }
  >
    Sign in with GitHub
  </button>
);
