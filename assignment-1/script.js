const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Get books from localStorage
const getDataFromLS = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// set books to localStorage
const setDataToLS = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Show modal
const showModal = (modal) => {
  $(modal).classList.add("show");
};

// Hide modal
const hideModal = (modal) => {
  $(modal).classList.remove("show");
};

// Show message
const showMessage = (content) => {
  const message = $("#message__content");
  message.innerText = content;
  message.parentElement.style.transform = "translateY(0)";

  setTimeout(() => {
    message.parentElement.style.transform = "translateY(calc(100% + 60px))";
  }, 3000);
};

// Render books
const renderBooks = (books) => {
  const textHtml = books.map((book) => {
    return `<tr>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.topic}</td>
                <td>
                  <button class="button button--link button__delete__book" data-id="${book.id}">Delete</button>
                </td>
            </tr>`;
  });

  $("#table__body").innerHTML = textHtml.join("");
};

// Handle search books by name.
const handleSearchBooks = (e) => {
  const searchTerm = e.target.value.trim().toLowerCase();

  const booksResult = books.filter((book) => {
    return book.name.toLowerCase().includes(searchTerm);
  });
  renderBooks(booksResult);
};

// Handle add new a book
const handleAddBook = (e) => {
  e.preventDefault();
  const name = $("input#name").value;
  const author = $("input#author").value;
  const topic = $("select#topic").value;
  const data = {
    id: Date.now(),
    name,
    author,
    topic,
  };

  books.push(data);
  renderBooks(books);
  hideModal("#modal__add");
  showMessage("Thêm dữ liệu thành công !");
  setDataToLS("books", books);
  $("#form__add").reset();
};

// Handle show modal delete  book
const handleShowModalDeleteBook = (rowId) => {
  showModal("#modal__delete");
  $("#modal__delete").setAttribute("data-id", rowId);
};

// Handle delete a book
const handleDeleteBook = () => {
  const rowId = $("#modal__delete").getAttribute("data-id");
  const index = books.findIndex((x) => x.id === parseInt(rowId));
  if (index != -1) {
    books.splice(index, 1);
    setDataToLS("books", books);
    renderBooks(books);
    hideModal("#modal__delete");
    showMessage("Xoá dữ liệu thành công !");
  }
};

// Initial data
const books = getDataFromLS("books") || [
  {
    id: 1,
    name: "Refactoring",
    author: "Martin Fowler",
    topic: "Programming",
  },
  {
    id: 2,
    name: "Design Data-Intensive Applications",
    author: "Martin Kleppmann",
    topic: "Database",
  },
  {
    id: 3,
    name: "The Phoenix Project",
    author: "Genne Kim",
    topic: "DevOps",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  setDataToLS("books", books);

  renderBooks(books);

  $("#search__input").addEventListener("input", handleSearchBooks);

  $("#form__add").addEventListener("submit", handleAddBook);

  for (const btnDelete of $$(".button__delete__book")) {
    btnDelete.addEventListener("click", () => {
      const rowId = btnDelete.getAttribute("data-id");
      handleShowModalDeleteBook(rowId);
    });
  }

  $("#button__confirm__delete").addEventListener("click", handleDeleteBook);
});
