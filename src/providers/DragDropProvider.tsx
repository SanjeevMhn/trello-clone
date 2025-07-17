import { BoardType, Task } from "@/components/TrelloBoard";
import { createContext, useContext, useState } from "react";

type DragDropContextType = {
  dragStartItem: Task | null;
  handleOnDragStart: (task: Task) => void;
  handleOnDrop: (board: BoardType) => void;
};

export const DragDropContext = createContext<DragDropContextType | null>(null);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) throw Error("useDragDrop must be within the DragDropProvider");
  return context;
};

export default function DragDropProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dragStartItem, setDragStartItem] = useState<Task | null>(null);

  const handleOnDragStart = (task: Task) => {
    setDragStartItem(task);
  };

  const handleOnDrop = (board: BoardType) => {
    console.log(dragStartItem, board);
  };

  const dragDropContextValue: DragDropContextType = {
    dragStartItem,
    handleOnDragStart,
    handleOnDrop,
  };
  return (
    <DragDropContext.Provider value={dragDropContextValue}>
      {children}
    </DragDropContext.Provider>
  );
}
