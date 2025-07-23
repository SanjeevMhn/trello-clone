"use client";

import { Controller, useForm } from "react-hook-form";
import { BoardType, Task } from "./TrelloBoard";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import TaskItem from "./TaskItem";
import { useDragDrop } from "@/providers/DragDropProvider";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import CustomAlertDialog from "./CustomAlertDialog";

const Board: FC<{
  board: BoardType;
  setBoards?: Dispatch<SetStateAction<Array<BoardType>>>;
  boards?: Array<BoardType>;
}> = ({ board, setBoards, boards }) => {
  const {
    register: registerTask,
    handleSubmit: handleTaskSubmit,
    formState: { errors: taskErrors },
    reset: resetTask,
  } = useForm<Task>();

  const [addNewTask, setAddNewTask] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<boolean>(false);

  const handleAddTask = (data: Task, boardId: number) => {
    let getBoards = boards!;
    let getBoardsById = getBoards.findIndex((board) => board.id == boardId);
    let boardTasks: Array<Task> = getBoards[getBoardsById].tasks || [];
    boardTasks.push({
      id: Date.now(),
      task: data.task,
    });
    getBoards[getBoardsById] = {
      ...getBoards[getBoardsById],
      tasks: boardTasks,
    };
    if(setBoards) setBoards(getBoards);
    setAddNewTask(false);
    resetTask();
  };

  const boardRef = useRef<any>(null);

  const handleEditTask = (taskData: Task, board: BoardType) => {
    let getBoards = [...boards!];
    let getBoardsById = getBoards.findIndex((brd) => brd.id == board.id);
    let boardTasks = [...getBoards[getBoardsById].tasks];
    let boardTaskId = boardTasks.findIndex((bt) => bt.id == taskData.id);
    boardTasks[boardTaskId] = {
      ...boardTasks[boardTaskId],
      ...taskData,
    };
    getBoards[getBoardsById] = {
      ...getBoards[getBoardsById],
      tasks: boardTasks,
    };
    if(setBoards)setBoards(getBoards);

    boardRef.current.resetEditTask();
  };

  const handleDeleteTask = (taskData: Task, board: BoardType) => {
    let getBoards = [...boards!];
    let getBoardsById = getBoards.findIndex((brd) => brd.id == board.id);
    let boardTasks = [...getBoards[getBoardsById].tasks];

    boardTasks = boardTasks.filter((bt) => bt.id !== taskData.id);
    getBoards[getBoardsById] = {
      ...getBoards[getBoardsById],
      tasks: boardTasks,
    };
    if(setBoards) setBoards(getBoards);

    boardRef.current.resetEditTask();
  };

  useEffect(() => {
    if (!addNewTask) resetTask();
  }, [addNewTask]);

  const {
    dragStartBoard,
    dragStartItem,
    handleOnDrop,
    handleEditBoardTitle,
    handleBoardDragStart,
    handleBoardDrop,
    handleDeleteBoard,
  } = useDragDrop();
  const [editBoardTitle, setEditBoardTitle] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<BoardType>({
    values: board,
  });

  const handleBoardTitleSubmit = (data: BoardType) => {
    handleEditBoardTitle(data);
    setEditBoardTitle(false);
    reset();
  };

  useEffect(() => {
    let keypress: any;
    keypress = document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key == "Escape") {
        reset();
        setAddNewTask(false);
        setEditBoardTitle(false);
      }
    });

    return () => {
      document.removeEventListener(keypress, () => {});
    };
  }, [addNewTask, editBoardTitle]);

  return (
    <div
      className="board"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() =>
        dragStartItem !== null
          ? handleOnDrop(board)
          : dragStartBoard !== null
          ? handleBoardDrop(board)
          : {}
      }
      draggable
      onDragStart={() => handleBoardDragStart(board)}
    >
      <div className="board-data bg-neutral-800 rounded-xl p-[0.5rem] h-auto">
        <header className="border-b-2 p-[0.5rem_0] border-white flex items-center justify-between">
          {!editBoardTitle ? (
            <span className="title-text title capitalize text-white" data-testid="board-header-text">
              {board.name}
            </span>
          ) : (
            <form
              className="w-full"
              onSubmit={handleSubmit(handleBoardTitleSubmit)}
            >
              <div className="form-group">
                <input
                  type="text"
                  id=""
                  className={`form-control p-[0.5rem] rounded-md border-2 bg-white text-black w-[calc(100%-calc(2*0.5rem))] ${
                    errors.name ? "border-red-700" : "border-black"
                  }`}
                  {...register("name", {
                    required: {
                      value: true,
                      message: "Board Title Required",
                    },
                    minLength: {
                      value: 2,
                      message: "Title must be atleast 2 characters long",
                    },
                  })}
                />
                {errors.name && (
                  <span className="text-red-700 pt-4">
                    {errors.name.message}
                  </span>
                )}
              </div>
            </form>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="icon-container w-[2.8rem] h-[2.8rem] flex items-center justify-center rounded-sm hover:bg-neutral-600">
                <svg
                  className="w-1/2 h-1/2 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                </svg>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-neutral-700 text-white">
              <DropdownMenuLabel>List Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setAddNewTask(true)}
              >
                Add Task
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setEditBoardTitle(true)}
              >
                Rename List
              </DropdownMenuItem>

              <CustomAlertDialog
                trigger={
                  <div className="cursor-pointer p-[0.6rem_0.8rem] hover:text-black hover:bg-white rounded-md text-[1.4rem] text-left w-full">
                    Delete List
                  </div>
                }
                title="Delete List"
                description="Delete this list? All the task within it will also be deleted!"
                onAction={() => handleDeleteBoard(board)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="task-container h-[calc(100%-calc(2*3.6rem))] my-2 flex flex-col gap-2">
          {board.tasks?.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              board={board}
              ref={boardRef}
            />
          ))}
        </div>
        <div className="footer">
          {!addNewTask ? (
            <button
              type="button"
              className="p-[0.5rem] pt-[0.8rem] rounded-lg bg-neutral-800 text-white w-full flex items-center gap-[1rem] hover:bg-neutral-600"
              onClick={() => setAddNewTask(true)}
              data-testid="add-task"
            >
              <span className="icon-container w-[1.8rem] h-[1.8rem] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-full h-full object-contain fill-white"
                >
                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                </svg>
              </span>
              <span className="label-text">Add Task</span>
            </button>
          ) : (
            <form
              onSubmit={handleTaskSubmit((data) =>
                handleAddTask(data, board.id)
              )}
              className="w-full bg-neutral-800 text-white p-[1.2rem] rounded-xl flex flex-col gap-5"
            >
              <div className="form-group">
                <input
                  type="text"
                  id=""
                  className={`form-control rounded-md text-black bg-white w-full text-[1.7rem] p-[0.25rem] focus:outline-blue-500 ${
                    taskErrors.task ? "border-red-600" : ""
                  }`}
                  placeholder="Task Title"
                  autoFocus
                  {...registerTask("task", {
                    required: {
                      value: true,
                      message: "Task Title Required",
                    },
                    minLength: {
                      value: 2,
                      message: "Task Title must be atleast 2 characters long",
                    },
                  })}
                  data-testid="add-task-input"
                />
                {taskErrors.task && (
                  <span className="text-red-300 pt-3 flex">
                    {taskErrors.task.message}
                  </span>
                )}
              </div>
              <div className="form-actions flex items-center gap-5">
                <button
                  type="submit"
                  className="bg-blue-400 p-[0.5rem] rounded-md text-[1.4rem] cursor-pointer"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  className="w-[3rem] h-[3rem] flex items-center justify-center cursor-pointer"
                  onClick={() => setAddNewTask(false)}
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
      </div>
    </div>
  );
};

export default Board;
