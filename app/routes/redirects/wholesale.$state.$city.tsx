import { redirect } from "react-router";
import type { Route } from "./+types/wholesale.$state.$city";

export function loader({ params }: Route.LoaderArgs) {
  throw redirect(`/roasted-wholesale-coffee/${params.state}/${params.city}`, 308);
}
