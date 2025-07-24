import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Board from "./Board";
import { BoardType } from "./TrelloBoard";
import DragDropProvider from "@/providers/DragDropProvider";

describe("Board Component", () => {
  let board: BoardType = {
    id: 1,
    name: "Doing",
    tasks: [],
  };
  beforeEach(() => {
    render(
      <DragDropProvider>
        <Board board={board} />
      </DragDropProvider>
    );
  });
  it("should render board name based on the prop", () => {
    expect(screen.getByTestId("board-header-text")).toHaveTextContent("Doing");
  });

  it("should display input field on add task button click", () => {
    const button = screen.getByTestId("add-task");
    const input = screen.queryByTestId("add-task-input");

    expect(input).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByTestId("add-task-input")).toBeVisible();
  });

  it('should hide input field on espace key press', () => {
    const button = screen.getByTestId("add-task");
    const input = screen.queryByTestId("add-task-input");
    expect(input).not.toBeInTheDocument()

    fireEvent.click(button)
    expect(screen.getByTestId('add-task-input')).toBeVisible()

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape', charCode: 27  } )
    expect(input).not.toBeInTheDocument()
  });

  it('should display error message when input is empty after form submitted', async () => {
    const button = screen.getByTestId("add-task");
    const handleTaskSubmit = vi.fn()
    expect(screen.queryByTestId("add-task-input")).not.toBeInTheDocument()

    fireEvent.click(button)
    expect(screen.getByTestId('add-task-input')).toBeVisible()
    expect(screen.getByTestId('submit-btn')).toBeVisible()
    const submitBtn = screen.getByTestId('submit-btn')

    fireEvent.input(screen.getByTestId('add-task-input'), {target: {value: ''}})
    fireEvent.click(submitBtn)

    expect(await screen.findByText('Task Title Required')).toBeInTheDocument()
    expect(handleTaskSubmit).not.toBeCalled()

  })

  it('should display error message when input is less than 2 characters long', async () => {
    const button = screen.getByTestId('add-task')
    const handleTaskSubmit = vi.fn()
    expect(screen.queryByTestId('add-task-input')).not.toBeInTheDocument()
    fireEvent.click(button)
    expect(screen.getByTestId('add-task-input')).toBeVisible()
    expect(screen.getByTestId('submit-btn')).toBeVisible()
    const submitBtn = screen.getByTestId('submit-btn')
    const input = screen.getByTestId('add-task-input')
    fireEvent.input(input, {target: {value: 'get'}})
    fireEvent.click(submitBtn)
    expect(await screen.findByText('Task Title must be atleast 4 characters long'))
    expect(handleTaskSubmit).not.toBeCalled()
  })

});
