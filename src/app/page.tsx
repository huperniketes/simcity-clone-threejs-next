
import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";
import { SimGame } from "~/simgame/simgame";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        <div>
          <SimGame />
        </div>
      </div>
    </main>
  );
}
