import { useQuery } from "react-query";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";
import News from "./News";

export default function Chart() {
  const [symbol, setSymbol] = useState("IBM");
  const debouncedSymbol = useDebounce(symbol, 300);

  const query = useQuery({
    queryKey: [`monthly`, debouncedSymbol],
    queryFn: () =>
      axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: `TIME_SERIES_MONTHLY`,
          symbol: debouncedSymbol,
          apikey: import.meta.env.VITE_ALPHAVANTAGE_APIKEY,
        },
      }),
  });

  const dataObj = query.data?.data["Monthly Time Series"] ?? {};
  const dataArr = Object.keys(dataObj)
    .slice(0, 12)
    .reverse()
    .map((key) => {
      const close = dataObj[key]["4. close"];
      const closeNumber = parseInt(close);

      return {
        date: dayjs(key).format("MMM YY"),
        close: closeNumber,
      };
    });

  return (
    <>
      <div className="p-20">
        <div className="mb-10 text-center">
          <h1 className="text-xl font-bold">Stock App</h1>

          <p className="mb-4">
            An application to display stock prices over the past year.
          </p>

          <form
            className="relative inline-block"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              type="text"
              className="rounded border border-gray-500 px-2 py-1 text-sm"
              placeholder="Ticker Symbol"
            />

            {query.isFetching ? (
              <div className="absolute inset-y-0 right-2 flex items-center justify-center">
                <div className="h-2 w-2 animate-spin rounded-full border-t border-black"></div>
              </div>
            ) : null}
          </form>
        </div>

        <ResponsiveContainer width="80%" height={400} className="mx-auto mb-8">
          <LineChart data={dataArr}>
            <Line type="monotone" dataKey="close" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>

        <News debouncedSymbol={debouncedSymbol} />
      </div>
    </>
  );
}
