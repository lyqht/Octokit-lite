import BackButton from '@/components/BackButton';
import { FC } from 'react';
import { HistoryRecord } from '../types/github';
interface Props {
  items: HistoryRecord[];
}

const HistoryLogs: FC<Props> = ({ items }) => {
  return (
    <div className="p-4">
      <BackButton />
      {items.map((item) => (
        <div className="flex flex-row gap-4 p-4" key={item.id}>
          <p className="p-1">{item.repo}</p>
          <p className="p-1">Deleted at {item.created_at}</p>
        </div>
      ))}
    </div>
  );
};

export default HistoryLogs;
