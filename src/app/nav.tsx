import Navbar from "@/components/navbar";
import Provider from "@/components/provider";
export default async function MainNavigation() {
  return (
    <Provider>
      <Navbar />
    </Provider>
  );
}
