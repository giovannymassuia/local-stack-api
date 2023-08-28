import { getApiUrl } from "./localstack";

test("get stack outputs", async () => {
  const apiUrl = await getApiUrl();
  console.log("apiUrl:", apiUrl);
});
