import { getPageList } from "./post/list";

export const GET = async () => {
  const posts = await getPageList(true); // Filter drafts
  return new Response(JSON.stringify(posts), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
