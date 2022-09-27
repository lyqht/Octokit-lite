import { UpdatedRecord } from '@/types/github';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../supabase';

type GetUpdatedRecordsResponse = UpdatedRecord[];

export interface ErrorResponse {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetUpdatedRecordsResponse | ErrorResponse>,
) {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: `User Id invalid` });
  }

  if (req.method === `GET`) {
    const { data, error } = await supabase
      .from<UpdatedRecord>(`UpdatedRecords`)
      .select(`*`)
      .eq(`userId`, `${userId}`);

    if (error) {
      console.error(error);
      return res.status(400).json({ message: JSON.stringify(error) });
    }

    res.status(200).json(data);
  }
}
