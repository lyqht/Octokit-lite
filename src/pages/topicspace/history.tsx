import { server } from '@/config';
import HistoryLogs from '@/layouts/HistoryLogs';
import { formatDateToLocaleString } from '@/utils/dateUtils';
import { getUser, withPageAuth } from '@supabase/auth-helpers-nextjs';
import { HistoryRecord, UpdatedRecord } from '../../types/github';

interface Props {
  items: UpdatedRecord[];
}

const History: React.FC<Props> = ({ items }) => {
  return (
    <HistoryLogs
      items={items}
      renderDescription={(item: HistoryRecord) => {
        const updatedRecord = item as UpdatedRecord;
        const addedTopics = updatedRecord.updatedFields.topics.filter(
          (topic) =>
            !updatedRecord.initialRepoDetails.prevTopics.includes(topic),
        );
        return (
          <div className="prose">
            Added {addedTopics.length} topic(s):
            {addedTopics.map((topic, index) => (
              <div
                key={`${item.id}-${topic}-${index}`}
                className="badge-slate-500 badge m-1"
              >
                {topic}
              </div>
            ))}
            at {formatDateToLocaleString(item.created_at)}
          </div>
        );
      }}
    />
  );
};

export default History;

export const getServerSideProps = withPageAuth({
  redirectTo: `/`,
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);
    const dbResponse = await fetch(
      `${server}/api/history/updated?userId=${user.id}`,
    );
    const items = await dbResponse.json();

    return { props: { user, items } };
  },
});
