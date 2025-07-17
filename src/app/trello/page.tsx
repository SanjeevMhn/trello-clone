import Navbar from "@/components/Navbar";
import TrelloBoard from "@/components/TrelloBoard";
import DragDropProvider from "@/providers/DragDropProvider";

const TrelloPage = () => {
  return (
    <>
      <Navbar />
      <DragDropProvider>
        <TrelloBoard />
      </DragDropProvider>
    </>
  );
};

export default TrelloPage;
