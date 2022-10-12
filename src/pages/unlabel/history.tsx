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
        const addedLabels = updatedRecord.initialRepoDetails.prevLabels?.filter(
          (label) => !updatedRecord.updatedFields.labels?.includes(label),
        );
        return (
          <div className="prose">
            Removed {addedLabels?.length} label(s):
            {addedLabels?.map((label, index) => (
              <div
                key={`${item.id}-${label}-${index}`}
                className="badge-slate-500 badge m-1"
              >
                {label}
              </div>
            ))}
            at {formatDateToLocaleString(item.created_at!)}
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
    const items: UpdatedRecord[] = await dbResponse.json();
    const filteredItems = items.filter(
      (item) => !!item.initialRepoDetails?.prevLabels,
    );
    return { props: { user, items: filteredItems } };
  },
});
