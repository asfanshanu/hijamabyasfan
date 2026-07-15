import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

interface TodoItem {
  id: string;
  name: string;
}

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  if (error) {
    return (
      <div className="p-8 font-sans">
        <h1 className="text-xl font-bold text-red-600 mb-2">Error Connecting to Supabase</h1>
        <p className="text-sm text-gray-700">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-8 font-sans">
      <h1 className="text-xl font-bold mb-4">Supabase Todos List</h1>
      {todos && todos.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {todos.map((todo: TodoItem) => (
            <li key={todo.id} className="text-sm text-gray-700">{todo.name}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No todos found. If you just initialized the database, make sure to create a &quot;todos&quot; table with a &quot;name&quot; column.</p>
      )}
    </div>
  )
}
