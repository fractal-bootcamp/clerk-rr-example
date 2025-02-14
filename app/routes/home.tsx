import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { redirect } from 'react-router'
import { getAuth } from '@clerk/react-router/ssr.server'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}


export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args)
  if (userId) {
    return redirect('/chatroom')
  }
  return null
}

export default function Home() {
  return <Welcome />;
}
