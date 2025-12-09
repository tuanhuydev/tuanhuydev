import Loader from "@resources/components/common/Loader";

export default async function Page() {
  return (
    <div className="flex justify-center items-center w-screen h-screen overflow-hidden">
      <Loader />
    </div>
  );
}
