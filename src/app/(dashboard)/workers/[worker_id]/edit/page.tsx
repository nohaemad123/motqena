import WorkerFormPage from "@/components/pages/workers/WorkerFormPage";

interface IWorkerViewProps {
  params: {
    worker_id: string;
  };
}

export default function page({ params: { worker_id } }: Readonly<IWorkerViewProps>) {
  return <WorkerFormPage isEdit workerId={worker_id} />;
}
