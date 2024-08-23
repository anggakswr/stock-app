import axios from "axios";
import { useQuery } from "react-query";

interface NewsProps {
  debouncedSymbol: string;
}

interface NewsPost {
  title: string;
  url: string;
  banner_image: string;
  summary: string;
}

export default function News(props: NewsProps) {
  const query = useQuery({
    queryKey: [`news`],
    queryFn: () =>
      axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: `NEWS_SENTIMENT`,
          symbol: props.debouncedSymbol,
          apikey: import.meta.env.VITE_ALPHAVANTAGE_APIKEY,
        },
      }),
  });

  const posts: NewsPost[] = query.data?.data.feed
    .filter((post: NewsPost) => post.banner_image)
    .slice(0, 9);

  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-xl font-bold">Relevant News</h1>
        <p className="mb-4">Related stock news.</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {posts?.map((post) => (
          <a
            key={post.url}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm visited:text-blue-500 hover:underline"
          >
            <div
              className="mb-2 h-40 w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${post.banner_image})`,
              }}
            />

            <p className="mb-2 line-clamp-2 font-bold">{post.title}</p>
            <p className="line-clamp-2">{post.summary}</p>
          </a>
        ))}
      </div>
    </>
  );
}
