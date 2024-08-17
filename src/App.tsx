import { QueryClient, QueryClientProvider } from "react-query";
import Chart from "./components/Chart";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Chart />
      </QueryClientProvider>
    </>
  );
}
