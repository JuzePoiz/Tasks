"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { ErroType, NewTaskUpdateType, taskType } from "@/app/_constructor/_Types";
import LoadingPage from "@/app/_constructor/LoadingPage";
import { AuthContext } from "@/app/contexts/AuthContext";

export default function TaskModal({ params }: { params: number }) {
  const [taskID, setTaskID]           = useState<number | null>(null);
  const [task, setTask] = useState<taskType | null>(null);
  const [getPriority, setPriority] = useState<string>("");
  const [getStatus, setStatus] = useState<string>("");
  const [ColorLineP, setColorLineP] = useState<boolean>(false);
  const [ColorLineS, setColorLineS] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState(false)
  const [erros, setErros] = useState<ErroType[]>([]);
  const {Ftasks, UpdateTask} = useContext(AuthContext)
  const router = useRouter();

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = params;
      setTaskID(resolvedParams);
      
      if (taskID === null) return;
      try {
        const taskFind = Ftasks?.find((task)=> task.ID == taskID) || null
        
        if (taskFind === null) {
          throw new Error(`Objeto com ID ${taskID} não encontrado`);
        }

        setTask(taskFind);
        const priorityClass = getPriorityClass(taskFind.Priority);
        const statusClass = getStatusClass(taskFind.Status);


        setPriority(priorityClass);
        setStatus(statusClass);
        setColorLineP(priorityClass === "text-media");
        setColorLineS(statusClass === "text-atuando");

      } catch (error) {
        console.error(error);
      }
    }
    resolveParams();
  }, [params, Ftasks, taskID]);

  const getPriorityClass = (priority: string): string => {
    switch (priority) {
      case "baixa":
        return "text-baixa";
      case "media":
        return "text-media";
      case "alta":
        return "text-alta";
      default:
        return "";
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case "atuando":
        return "text-atuando";
      case "completa":
        return "text-completa";
      case "abandonada":
        return "text-abandonada";
      default:
        return "";
    }
  };

  async function hamdleSubmit() {
    setLoading(true)
    const NewTask: NewTaskUpdateType = {
      Name: task?.Nome || null,
      Descrição: task?.Descricao || null,
      Priority: task?.Priority || null,
      Status: task?.Status || null,
      TaskID: task?.ID || null
  }
      try{
        const upDate = await UpdateTask(NewTask)
        if(upDate){
          setLoading(false)
          setErros(upDate)
          setTimeout(() => {
            setErros((prev) => prev.filter((e) => e.id !== upDate[0].id)); 
      }, 5000);
        }else{
          router.push(`/User`)
        }
      }catch(e){
        console.error('Erro: ', e)
      }
  }

  if (!task) {
    return <LoadingPage absolt={true} />;
  }

  return (
    <div
      className="absolute h-2/3 w-2/3 
    bg-hot-300 text-cold-800 
    flex flex-col rounded-t-xl"
    >
      
      {edit ? (
        <div className="z-20  h-full w-full absolute flex flex-col items-center bg-cold-900/30">
          {erros.map((erro) => (
                <div
                  key={erro.id}
                  className=" absolute
                  w-2/4 top-0 bg-yellow-300 text-zinc-800 flex items-center p-2 rounded shadow-lg mt-4 text-xl z-50"
                >
                  <p className="flex-1">{erro.message}</p>
                  <IoIosClose
                    className="cursor-pointer text-2xl ml-2"
                    onClick={() => setErros((prev) => prev.filter((e) => e.id !== erro.id))}
                  />
                </div>
              ))}
          {loading ? <LoadingPage absolt={true} /> : ''}
          <div className=" absolute h-3/4 w-3/4 top-1 ">
            <section className="flex justify-between items-center bg-cold-900 text-hot-800 p-2">
              <h1>Edit Task {task.Nome}</h1>
              <p onClick={() => setEdit(false)}>
                <IoIosClose className="text-2xl cursor-pointer"/>
              </p>
            </section>
            <section className="bg-hot-500 p-4  h-full">
              <form
                className="flex flex-col justify-between w-full h-full overflow-clip"
                onSubmit={(e) => {
                  e.preventDefault();
                  hamdleSubmit();
                }}
              >
                <label>
                  <h1 className="mb-2">Nome da task</h1>
                  <input
                    className=" text-base p-1 w-full bg-cold-800 text-hot-900 rounded "
                    type="text"
                    name="Nome"
                    id="Nome"
                    value={task.Nome}
                                onChange={(e) => setTask((prev) =>
                                  prev ? { ...prev, Nome: e.target.value } : null 
                                )}
                  />
                </label>
                <label>
                  <h1 className="mb-2">Descrição da task</h1>
                  <textarea
                    name="Descrição"
                    id="Descrição"
                    className="w-full h-full bg-cold-800 text-hot-900 rounded p-1 resize-none"
                    value={task.Descricao}
                                onChange={(e) => setTask((prev) =>
                                  prev ? { ...prev, Descricao: e.target.value } : null 
                                )}
                  ></textarea>
                </label>
                <label className="flex items-center mb-4 mt-8">
                  <h1 className="mr-2">Status inicial: </h1>
                  <select
                    className="bg-hot-800 text-cold-800 text-lg"
                    onChange={(e) => setTask((prev) =>
                      prev ? { ...prev, Status: e.target.value } : null 
                    )}
                    value={task.Status}
                    name="status"
                    id="status"
                  >
                    <option value="atuando">Atuando</option>
                    <option value="completa">Completa</option>
                    <option value="abandonada">Abandonada</option>
                  </select>
                </label>
                <label className="flex items-center mb-4">
                  <h1 className="mr-2">Prioridade inicial: </h1>
                  <select
                    className="bg-hot-800 text-cold-800 text-lg"
                    name="prioridade"
                    id="prioridade"
                    value={task.Priority}
                                onChange={(e) => setTask((prev) =>
                                  prev ? { ...prev, Priority: e.target.value } : null 
                                )}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </label>
                
                <input
                  type="submit"
                  value="Enviar"
                  className="w-full p-2 buttonHAnimationINV bg-hot-700 text-cold-700 rounded"
                />
              </form>
            </section>
          </div>
        </div>
      ) : (
        ""
      )}
      <section
        className="bg-cold-700 p-2 text-hot-800
            border-b-2 border-hot-900 rounded-t-lg
            top-0 w-full
            flex items-center justify-between
            "
      >
        <h1>{task.Nome}</h1>
        <button onClick={() => router.back()}>
          <IoIosClose className="text-2xl" />
        </button>
      </section>
      <section className="m-4 h-full">
        <div className="h-4/5">
          <h2 className="flex justify-between items-center">
            <p>Descrição</p>
            <button onClick={() => setEdit(true)}>Editar</button>
          </h2>
          <p
            className="bg-cold-600 border border-hot-800 rounded text-hot-800 p-2 
                    h-full
                    overflow-auto text-ellipsis 
                    "
          >
            {task.Descricao}
          </p>
        </div>
        <div className="flex mt-6">
          <h3>Status </h3>:
          <p
            className={` ml-2 ${getStatus} 
                        ${ColorLineS ? "textoLinha" : ""}
                        `}
          >
            {task.Status}
          </p>
        </div>
        <div className="flex">
          <h3>Prioridade </h3>:
          <p
            className={`ml-2 ${getPriority}
                        ${ColorLineP ? "textoLinha" : ""}
                        `}
          >
            {task.Priority}
          </p>
        </div>
      </section>
    </div>
  );
}
