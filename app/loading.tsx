import Loader from "@app/components/commons/Loader";

export default async function Page() {
  return (
    <div className="flex justify-center items-center w-screen h-screen overflow-hidden">
      <Loader />
    </div>
  );
}
