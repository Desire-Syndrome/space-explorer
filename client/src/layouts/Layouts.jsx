import Header from "./Header";
import Footer from "./Footer";


function Layouts({ children }) { 
  return (<>

    <Header />
      <main className="min-h-screen w-full">{children}</main>
    <Footer />
    
  </>);
}
 
export default Layouts;