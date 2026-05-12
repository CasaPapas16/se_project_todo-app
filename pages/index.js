import { v4 as uuidv4 } from "https://jspm.dev/uuid";

import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPoopupEl = document.querySelector("#add-todo-popup");
const addTodoForm = document.forms["add-todo-form"];
const addTodoCloseBtn = addTodoPoopupEl.querySelector(".popup__close");
const todosList = document.querySelector(".todos__list");

const todoCounter = new TodoCounter(initialTodos, ".counter__text");

const addTodoPoopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (formValues) => {
    const { name, date } = formValues;

    // Create a date object and adjust for timezone
    const adjustedDate = new Date(date);
    adjustedDate.setMinutes(
      adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset(),
    );

    const values = { name, date: adjustedDate, id: uuidv4() };

    addTodoToList(values);
    todoCounter.updateTotal(true);
    newTodoValidator.resetValidation();
    addTodoPoopup.close();
  },
});
addTodoPoopup.setEventListeners();

const section = new Section({
  items: initialTodos,
  renderer: (item) => {
    const todo = new Todo(item, "#todo-template", {
      handleCheck,
      handleDelete,
    });
    return todo.getView();
  },
  containerSelector: ".todos__list",
});

section.renderItems();

function handleCheck(isCompleted) {
  todoCounter.updateCompleted(isCompleted);
}

function handleDelete(wasCompleted) {
  if (wasCompleted) {
    todoCounter.updateCompleted(false);
  }
  todoCounter.updateTotal(false);
}

// The logic in this function should all be handled in the Todo class.
const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template", { handleCheck, handleDelete });
  const todoElement = todo.getView();

  return todoElement;
};

const addTodoToList = (todoData) => {
  const todo = generateTodo(todoData);
  section.addItem(todo);
  return todo;
};

addTodoButton.addEventListener("click", () => {
  addTodoPoopup.open();
});

const newTodoValidator = new FormValidator(validationConfig, addTodoForm);
newTodoValidator.enableValidation();
