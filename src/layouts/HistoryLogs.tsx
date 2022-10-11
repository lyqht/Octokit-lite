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
        <div className="flex w-full justify-between">
          <BackButton />
          <Link href="https://docs.github.com/en/repositories/creating-and-managing-repositories/restoring-a-deleted-repository">
            <div className="flex cursor-pointer items-center">
              <span className="p-1 text-sm sm:text-base">
                How to restore deleted projects
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 flex-shrink-0 stroke-info stroke-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                ></path>
              </svg>
            </div>
          </Link>
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
      </div>
      <Footer />
    </div>
  );
};

export default HistoryLogs;
