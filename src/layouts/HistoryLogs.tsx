import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FC, ReactElement } from 'react';
import { HistoryRecord } from '../types/github';
interface Props {
  items: HistoryRecord[];
  renderDescription: (item: HistoryRecord) => ReactElement;
}

const HistoryLogs: FC<Props> = ({ items, renderDescription }) => {
  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="flex w-full lg:w-4/5">
          <BackButton />
        </div>
        <table className="table-zebra table w-full lg:w-4/5">
          <thead>
            <tr>
              <th className="bg-secondary pl-2 pr-4 text-center font-mono text-sm">
                ID
              </th>
              <th className="bg-secondary font-mono text-sm">NAME</th>
              <th className="bg-secondary font-mono text-sm">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id}>
                <th className="py-3 pl-2 pr-4 text-center">{i + 1}.</th>
                <td className="p-3">
                  <code className="text-sm">{item.repo}</code>
                </td>
                <td className="whitespace-pre-line p-2">
                  {renderDescription ? renderDescription(item) : ``}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link href="https://docs.github.com/en/repositories/creating-and-managing-repositories/restoring-a-deleted-repository">
          Unforked a wrong repo? Want to restore it
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default HistoryLogs;
