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
  dragStartBoard: BoardType | null;
  boards: Array<BoardType>;
  setBoards: Dispatch<SetStateAction<Array<BoardType>>>;
  handleOnDragStart: (task: Task, board: BoardType) => void;
  handleOnDrop: (board: BoardType) => void;
  handleEditBoardTitle: (board: BoardType) => void;
  handleBoardDragStart: (board: BoardType) => void;
  handleBoardDrop: (board: BoardType) => void;
  handleDeleteBoard: (board:BoardType) => void;
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
  const [boards, setBoards] = useState<Array<BoardType>>([
    {
      id: 1,
      name: "Backlog",
      tasks: [],
    },
    {
      id: 2,
      name: "Doing",
      tasks: [],
    },
    {
      id: 3,
      name: "QA",
      tasks: [],
    },
    {
      id: 4,
      name: "Redo",
      tasks: [],
    },
    {
      id: 5,
      name: "Completed",
      tasks: [],
    },
  ]);

  const handleOnDragStart = (task: Task, board: BoardType) => {
    setDragStartItem(task);
    setDragStartBoard(board);
  };

  const handleOnDrop = (board: BoardType) => {
    let getBoards = [...boards];
    let getFromBoard = getBoards.findIndex((bd) => bd.id == dragStartBoard!.id);
    let getToBoard = getBoards.findIndex((bd) => bd.id == board.id);

    getBoards[getFromBoard].tasks = getBoards[getFromBoard].tasks.filter(
      (ts) => ts.id !== dragStartItem!.id
    );
    getBoards[getToBoard].tasks.push(dragStartItem!);

    setBoards(getBoards);
    setDragStartItem(null);
    setDragStartBoard(null);
  };

  const handleEditBoardTitle = (data: BoardType) => {
    let getBoards = [...boards];
    let getBoardById = getBoards.findIndex((bg) => bg.id == data.id);

    getBoards[getBoardById] = {
      ...getBoards[getBoardById],
      ...data,
    };

    setBoards(getBoards);
  };

  const handleBoardDragStart = (board: BoardType) => {
    setDragStartBoard(board);
  };

  const handleBoardDrop = (board: BoardType) => {
    let getBoards = [...boards];
    let getDraggedBoardIndex = getBoards.findIndex(
      (bd) => bd.id == dragStartBoard?.id
    );
    let droppedBoardIndex = getBoards.findIndex((db) => db.id == board.id);

    getBoards[droppedBoardIndex] = dragStartBoard!;
    getBoards[getDraggedBoardIndex] = board;

    setBoards(getBoards);
    setDragStartBoard(null);
  };

  const handleDeleteBoard = (board:BoardType) => {
    let getBoards = [...boards]
    getBoards = getBoards.filter(bd => bd.id !== board.id)

    setBoards(getBoards)
  }

  const dragDropContextValue: DragDropContextType = {
    boards,
    setBoards,
    dragStartItem,
    dragStartBoard,
    handleOnDragStart,
    handleOnDrop,
    handleEditBoardTitle,
    handleBoardDragStart,
    handleBoardDrop,
    handleDeleteBoard
  };
  return (
    <DragDropContext.Provider value={dragDropContextValue}>
      {children}
    </DragDropContext.Provider>
  );
}
