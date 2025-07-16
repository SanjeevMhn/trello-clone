"use client";

import { useForm } from "react-hook-form";
import { BoardType, Task } from "./TrelloBoard";
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import TaskItem from "./TaskItem";

const Board: FC<{
  board: BoardType;
  setBoards: Dispatch<SetStateAction<Array<BoardType>>>;
  boards: Array<BoardType>;
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
    let getBoards = boards;
    let getBoardsById = getBoards.findIndex((board) => board.id == boardId);
    let boardTasks: Array<Task> = getBoards[getBoardsById].tasks || [];
    boardTasks.push({
      id: getBoards.length + 1,
      task: data.task,
    });
    getBoards[getBoardsById] = {
      ...getBoards[getBoardsById],
      tasks: boardTasks,
    };
    setBoards(getBoards);
    setAddNewTask(false);
    resetTask();
  };

  const boardRef = useRef<any>(null)

  const handleEditTask = (taskData: Task, board: BoardType) => {
    let getBoards = [...boards];
    let getBoardsById = getBoards.findIndex((brd) => brd.id  == board.id)
    let boardTasks = [...getBoards[getBoardsById].tasks]
    let boardTaskId = boardTasks.findIndex(bt => bt.id == taskData.id)
    boardTasks[boardTaskId] = {
      ...boardTasks[boardTaskId],
      ...taskData
    }
    getBoards[getBoardsById] = {
      ...getBoards[getBoardsById],
      tasks: boardTasks
    }
    setBoards(getBoards)
    
    boardRef.current.resetEditTask()
  };

  useEffect(() => {
    if (!addNewTask) resetTask();
  }, [addNewTask]);

  return (
    <div className="board">
      <div className="board-data bg-neutral-800 rounded-xl p-[0.5rem] h-auto">
        <header className="title capitalize text-white border-b-2 p-[0.5rem_0] border-white">
          {board.name}
        </header>
        <div className="task-container h-[calc(100%-calc(2*3.6rem))] my-2 flex flex-col gap-2">
          {board.tasks?.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleEditTask={handleEditTask}
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
