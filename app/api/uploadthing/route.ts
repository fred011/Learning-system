import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Ensure that GET and POST are named exports
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
