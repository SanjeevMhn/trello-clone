"use client";
import { BoardType, Task } from "@/components/TrelloBoard";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type DragDropContextType = {
  dragStartItem: Task | null;
  boards: Array<BoardType>;
  setBoards: Dispatch<SetStateAction<Array<BoardType>>>;
  handleOnDragStart: (task: Task, board: BoardType) => void;
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
  const [dragStartBoard, setDragStartBoard] = useState<BoardType | null>(null);
  const [boards, setBoards] = useState<Array<BoardType>>([]);

  const handleOnDragStart = (task: Task, board: BoardType) => {
    setDragStartItem(task);
    setDragStartBoard(board);
  };

  const handleOnDrop = (board: BoardType) => {

    let getBoards = [...boards];
    let getFromBoard = getBoards.findIndex((bd) => bd.id == dragStartBoard!.id);
    let getToBoard = getBoards.findIndex((bd) => bd.id == board.id);

    getBoards[getFromBoard].tasks = getBoards[getFromBoard].tasks.filter((ts) => ts.id !== dragStartItem!.id);
    getBoards[getToBoard].tasks.push(dragStartItem!);

    setBoards(getBoards)
    setDragStartItem(null)
    setDragStartBoard(null)
  };

  const dragDropContextValue: DragDropContextType = {
    dragStartItem,
    handleOnDragStart,
    handleOnDrop,
    boards,
    setBoards,
  };
  return (
    <DragDropContext.Provider value={dragDropContextValue}>
      {children}
    </DragDropContext.Provider>
  );
}
