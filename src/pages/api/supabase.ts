import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { DeletedRecord } from './github';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ``;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ``;
export const supabase = createClient(supabaseUrl, supabaseKey);

type GetDeletedRecordsResponse = DeletedRecord[];

export interface ErrorResponse {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetDeletedRecordsResponse | ErrorResponse>,
) {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: `User Id invalid` });
  }

  if (req.method === `GET`) {
    const { data, error } = await supabase
      .from<DeletedRecord>(`DeletedRecords`)
      .select(`*`)
      .eq(`userId`, `${userId}`);

    if (error) {
      console.error(error);
      return res.status(400).json({ message: JSON.stringify(error) });
    }

    res.status(200).json(data);
  }
}
