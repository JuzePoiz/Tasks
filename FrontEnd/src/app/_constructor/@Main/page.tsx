'use client'
import { useRouter } from "next/navigation";

export default function Main() {
  const router = useRouter()

    return (
      <main className="h-full  flex flex-col items-center justify-center">
        <section className="h-2/4 max-[800px]:my-20 flex flex-col items-center">
          <h1 className="text-7xl max-[800px]:text-4xl">Aplicativo de Tarefas</h1>
          <h2 className="text-xl mt-4 mb-4 text-center">Para acessar suas tarefas e criar novas, entre com sua conta aqui: </h2>
          <button
          onClick={()=>router.push('/Login')}
            className="
          w-auto
           bg-cold-900 text-hot-800 
           border border-hot-900 rounded 
           p-6 buttonHAnimation text-xl
           "> Login </button>
        </section>
      </main>
    )
  }