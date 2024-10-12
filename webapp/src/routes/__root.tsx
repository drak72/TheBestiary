import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Layout } from "../layouts/layout";

export const Route = createRootRouteWithContext<{ items: string[] }>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
}
