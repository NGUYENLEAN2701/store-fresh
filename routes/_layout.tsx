import { define } from "../utils.ts";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";

export default define.layout(function PublicLayout({ Component }) {
  return (
    <>
      <Header />
      <main>
        <Component />
      </main>
      <Footer />
    </>
  );
});
