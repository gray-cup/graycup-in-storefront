import { redirect } from "react-router";
import type { Route } from "./+types/wholesale.$state";

export function loader({ params }: Route.LoaderArgs) {
  throw redirect(`/roasted-wholesale-coffee/${params.state}`, 308);
}
