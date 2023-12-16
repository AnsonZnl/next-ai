import { NextRequest, NextResponse } from 'next/server';

const client_id = '';
const client_secret = '';
const grant_type = '';
// ref: https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Ilkkrb0i5
export async function GET(request: NextRequest) {
  const url = `https://aip.baidubce.com/oauth/2.0/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=${grant_type}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  const result = await fetch(url, options);
  const data = await result.json();
  return NextResponse.json(data);
}
