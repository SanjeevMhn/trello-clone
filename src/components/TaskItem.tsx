import {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { BoardType, Task } from "./TrelloBoard";
import { useForm } from "react-hook-form";
import CustomAlertDialog from "./CustomAlertDialog";

const TaskItem = forwardRef<
  { resetEditTask: () => void },
  {
    task: Task;
    board: BoardType;
    handleEditTask: (taskData: Task, board: BoardType) => void;
    handleDeleteTask: (taskData: Task, board: BoardType) => void;
  }
>(({ task, board, handleEditTask, handleDeleteTask }, ref) => {
  const [editTask, setEditTask] = useState<boolean>(false);
  useEffect(() => {
    let escKey: any;
    escKey = document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key == "Escape") setEditTask(false);
    });

    return () => {
      document.removeEventListener(escKey, () => {});
    };
  }, []);

  const resetEditTask = () => {
    setEditTask(false);
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        resetEditTask,
      };
    },
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Task>({
    values: task,
  });

  return (
    <div
      className="task p-[0.5rem] rounded-lg bg-neutral-600 text-neutral-300 text-[1.6rem] cursor-pointer group"
      key={task.id}
      draggable
      onDragOver={(e) => e.preventDefault()}
    >
      {!editTask ? (
        <div className="flex items-center gap-2">
          <span className="task-text grow">{task.task}</span>
          <span
            className="icon-container ml-auto flex-[1.5rem] w-[1.5rem] h-[1.5rem] items-center justify-center grow-0 hidden group-hover:flex"
            onClick={() => setEditTask(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-full h-full fill-white"
            >
              <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
            </svg>
          </span>
          <CustomAlertDialog
            trigger={
              <span className="icon-container ml-auto flex-[1.5rem] w-[1.5rem] h-[1.5rem] items-center justify-center grow-0 hidden group-hover:flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-full h-full fill-white"
                >
                  <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                </svg>
              </span>
            }
            title={"Delete Task?"}
            description={"Do you want to delete this task?"}
            onAction={() => handleDeleteTask(task,board)}
          />
        </div>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((data) => handleEditTask(data, board))}
        >
          <div className="form-group">
            <input
              type="text"
              className="form-control rounded-md text-black bg-white w-full text-[1.7rem] p-[0.25rem] focus:outline-blue-500 "
              // defaultValue={task.task}
              {...register("task", {
                required: "Task title required",
              })}
              autoFocus
            />
            {errors.task && (
              <span className="text-red-700">{errors.task.message}</span>
            )}
          </div>
          <div className="form-actions flex justify-end gap-4 items-center">
            <button
              type="submit"
              className="bg-blue-400 p-[0.5rem] rounded-md text-[1.5rem] min-w-[5rem] cursor-pointer text-white"
            >
              Edit
            </button>
            <button
              type="button"
              className="w-[2.5rem] h-[2.5rem] flex items-center justify-center cursor-pointer"
              onClick={() => setEditTask(false)}
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
  );
});

export default TaskItem;
