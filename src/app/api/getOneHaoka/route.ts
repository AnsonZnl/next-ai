import { NextResponse } from 'next/server';
import { haokaJson } from '@/config/haoka';
export async function POST(request: Request) {
  const { query } = await request.json();
  const results = haokaJson.filter((card: any) =>
    query.includes(card.operator)
  );
  let result: any = {};
  if (results.length > 0) {
    const randomIndex = Math.floor(Math.random() * results.length);
    result = results[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * haokaJson.length);
    result = haokaJson[randomIndex];
  }

  return NextResponse.json({
    code: 0,
    data: `\n商品名称：${result.productName}\n运营商：${result.operator}\n号码归属地：${result.area}\n禁发区域：${result.disableArea}\n商品主图：<img src="${result.mainPic}">\n商品二维码：<img src="https://haokaapi.lot-ml.com/Temps/TuiguangCode/294140-${result.productID}.png">\n\r`,
  });
}
