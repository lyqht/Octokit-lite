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
        <table className="table-zebra table w-full">
          <thead>
            <tr>
              <th>𝗜𝗗</th>
              <td>
                <span className="px-2 font-bold">𝗡𝗔𝗠𝗘</span>
              </td>
              <td>
                <p className="px-1">𝗔𝗖𝗧𝗜𝗢𝗡</p>
              </td>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id}>
                <th>{i + 1}.</th>
                <td>
                  <p className="px-2">{item.repo}</p>
                </td>
                <td>{renderDescription ? renderDescription(item) : ``}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default HistoryLogs;
