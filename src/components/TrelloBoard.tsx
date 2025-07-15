"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Board from "./Board";

type User = {
  id: number | string;
  name: string;
  online?: boolean;
};

export type Task = {
  id: number;
  task: string;
  assigned_to?: User | Array<User>;
};

export type BoardType = {
  id: number;
  name: string;
  tasks: Array<Task>;
};

const TrelloBoard = () => {
  const [boards, setBoards] = useState<Array<BoardType>>([]);

  const [addNewBoard, setAddNewBoard] = useState(false);
  const {
    register: registerBoard,
    handleSubmit: handleBoardSubmit,
    formState: { errors: boardErrors },
    reset: resetBoardState,
  } = useForm<{
    name: string;
  }>();

  const handleAddBoard = (data: { name: string }) => {
    setBoards([...boards, { id: boards.length + 1, name: data.name, tasks: [] }]);
    setAddNewBoard(false);
    resetBoardState();
  };

  useEffect(() => {
    if (!addNewBoard) {
      resetBoardState();
    }
  }, [addNewBoard]);


  return (
    <div className="wrapper overflow-y-auto bg-blue-200 h-[calc(100vh-7rem)]">
      <main
        className="trello-board-main p-[2rem] grid gap-5 h-auto"
        style={{
          gridTemplateColumns: `repeat(${
            boards ? boards.length + 1 : 1
          }, min(32rem,90%))`,
        }}
      >
        {boards.map((board) => (
          <Board
            setBoards={setBoards}
            boards={boards}
            board={board}
            key={board.id}
          />
        ))}
        <div className="add-board">
          {!addNewBoard ? (
            <button
              type="button"
              className="p-[1rem_2rem] border cursor-pointer text-[2rem] rounded-lg bg-neutral-300 text-black w-full flex items-center gap-[1rem]"
              onClick={() => setAddNewBoard(true)}
            >
              <span className="icon-container w-[1.8rem] h-[1.8rem] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-full h-full object-contain"
                >
                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                </svg>
              </span>
              <span className="label-text">Add Board</span>
            </button>
          ) : (
            <form
              onSubmit={handleBoardSubmit(handleAddBoard)}
              className="w-full bg-neutral-800 text-white p-[1.2rem] rounded-xl flex flex-col gap-5"
            >
              <div className="form-group">
                <input
                  type="text"
                  id=""
                  className={`form-control rounded-md text-black bg-white w-full text-[1.7rem] p-[0.25rem] focus:outline-blue-500 ${
                    boardErrors.name ? "border-red-600" : ""
                  }`}
                  placeholder="Board Name"
                  autoFocus
                  {...registerBoard("name", {
                    required: {
                      value: true,
                      message: "Board Name Required",
                    },
                    minLength: {
                      value: 2,
                      message: "Board Name must be atleast 2 characters long",
                    },
                  })}
                />
                {boardErrors.name && (
                  <span className="text-red-300 pt-3 flex">
                    {boardErrors.name.message}
                  </span>
                )}
              </div>
              <div className="form-actions flex items-center gap-5">
                <button
                  type="submit"
                  className="bg-blue-400 p-[0.5rem] rounded-md text-[1.4rem] cursor-pointer"
                >
                  Add List
                </button>
                <button
                  type="button"
                  className="w-[3rem] h-[3rem] flex items-center justify-center cursor-pointer"
                  onClick={() => setAddNewBoard(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    className="w-full h-full fill-white"
                  >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrelloBoard;
