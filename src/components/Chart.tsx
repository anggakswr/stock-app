import { useQuery } from "react-query";
import axios1 from "../helpers/axios1";
// import kFormatter from "../helpers/kFormat";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import dayjs from "dayjs";

export default function Chart() {
  const query = useQuery(`monthly`, () =>
    axios1.get(`/query`, {
      params: {
        function: `TIME_SERIES_MONTHLY`,
        symbol: `IBM`,
        apikey: `RIBXT3XYLI69PC0Q`,
      },
    })
  );

  console.log("query.data", query.data?.data["Monthly Time Series"]);

  const dataObj = query.data?.data["Monthly Time Series"] ?? {};
  const dataArr = Object.keys(dataObj)
    .slice(0, 12)
    .reverse()
    .map((key) => {
      const close = dataObj[key]["4. close"];
      const closeNumber = parseInt(close);

      return {
        date: dayjs(key).format("MMM YYYY"),
        close: closeNumber,
      };
    });

  console.log({ dataArr });

  return (
    <>
      <div className="p-20">
        <h1 className="text-center font-bold text-xl">Stock App</h1>
        <p className="mb-10">asd</p>

        <LineChart className="mx-auto" width={1000} height={500} data={dataArr}>
          <Line type="monotone" dataKey="close" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip />
        </LineChart>
      </div>
    </>
  );
}
