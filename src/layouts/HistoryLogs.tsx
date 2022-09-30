import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import { FC, ReactElement } from 'react';
import { HistoryRecord } from '../types/github';
interface Props {
  items: HistoryRecord[];
  renderDescription: (item: HistoryRecord) => ReactElement;
}

const HistoryLogs: FC<Props> = ({ items, renderDescription }) => {
  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="p-4">
        <BackButton />
        {items.map((item) => (
          <div className="flex flex-row gap-4 p-4" key={item.id}>
            <p className="p-1">{item.repo}</p>
            {renderDescription ? renderDescription(item) : ``}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default HistoryLogs;
