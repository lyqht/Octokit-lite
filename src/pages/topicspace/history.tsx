import { server } from '@/config';
import HistoryLogs from '@/layouts/HistoryLogs';
import { getUser, withPageAuth } from '@supabase/auth-helpers-nextjs';
import { HistoryRecord } from '../../types/github';

interface Props {
  items: HistoryRecord[];
}

const History: React.FC<Props> = ({ items }) => {
  return <HistoryLogs items={items} />;
};

export default History;

export const getServerSideProps = withPageAuth({
  redirectTo: `/`,
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);
    const dbResponse = await fetch(`${server}/api/history/updated?userId=${user.id}`);
    const items = await dbResponse.json();

    return { props: { user, items } };
  },
});
