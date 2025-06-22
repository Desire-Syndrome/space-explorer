import Header from "./Header";
import Footer from "./Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";


function Layouts({ children }) {
  return (<>

    <Header />
    <main className="min-h-screen w-full">{children}</main>
    <ScrollToTopButton />
    <Footer />

  </>);
}

export default Layouts;