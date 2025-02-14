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

export default function Home() {
  return <Welcome />;
}
