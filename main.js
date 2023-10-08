
const books = [];
const EVENT_CHANGE = "change-books";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKSELF_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
    var x = document.getElementById("snackbar");
    x.children[0].className = "show";
    setTimeout(function () {
      x.children[0].className = x.children[0].className.replace("show", "");
    }, 2000);
    e.target.reset();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak support localstorage, coba ganti browser/update");
    return false;
  }
  return true;
}

function addBook() {
  const inputTitle = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = parseInt(document.getElementById("date").value); 
    year.toString().slice(0, 4);

  const generatedID = generateId();
  const newBook = generateNewBook(
    inputTitle,
    generatedID,
    author,
    year,
    false
  );
  books.push(newBook);

  document.dispatchEvent(new Event(EVENT_CHANGE));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateNewBook(title,id,author, year, isComplete) {
  return {
    title,
    id,
    author,
    year,
    isComplete,
  };
}

function makeBook(newBook) {
  const bookTitle = document.createElement("h2");
  bookTitle.innerText = newBook.title;

  const authorName = document.createElement("p");
  authorName.innerText = newBook.author;
  const bookYear = document.createElement("p");
  bookYear.innerText = newBook.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(bookTitle, authorName, bookYear);

  const container = document.createElement("div");
  container.classList.add("item", "list-item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${newBook.id}`);

  if (newBook.isComplete) {
    const undoButton = document.createElement("img");
    undoButton.setAttribute("src", "assets/undo-outline.svg");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      if (confirm("Anda Yakin Mengembalikan Buku ke Daftar Belum DIbaca?")) {
        undoBookTitleFromReaded(newBook.id);
        var x = document.getElementById("snackbar");
        x.children[4].className = "show";
        setTimeout(function () {
          x.children[4].className = x.children[4].className.replace("show", "");
        }, 2000);
      } else {
      }
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      if (confirm("Anda Yakin Menghapus Buku Dari Bookshelf?")) {
        removeBookTitleFromReaded(newBook.id);
        var x = document.getElementById("snackbar");
        x.children[3].className = "show";
        setTimeout(function () {
          x.children[3].className = x.children[3].className.replace("show", "");     
         },2000);
        } else {
      }
    });

    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");

    editButton.addEventListener("click", function (e) {
      if (confirm("Silahkan tambah deskripsi, tekan cancel jika selesai!")) {
        editButton.classList.remove("edit-button");
        editButton.classList.add("save-button");
        const inputBaru = document.createElement("input");
        const titleBaru = document.createElement("h4");

        inputBaru.appendChild(titleBaru);
        textContainer.appendChild(inputBaru);
        container.append(textContainer);
        editButton.addEventListener("click", function () {
          editButton.classList.remove("save-button");
          editButton.classList.add("edit-button");
          var x = document.getElementById("snackbar");
          x.children[5].className = "show";
          setTimeout(function () {
            x.children[5].className = x.children[5].className.replace("show", "");     
           },2000);
        });
      } else {
      }
    });

    container.append(undoButton, trashButton, editButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      if (confirm("Anda Yakin Buku Telah Dibaca?")) {
        addBookTitleToReadList(newBook.id);
        var x = document.getElementById("snackbar");
        x.children[2].className = "show";
        setTimeout(function () {
          x.children[2].className = x.children[2].className.replace("show", "");     
         },2000);
      } else {
      }
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      if (confirm("Anda Yakin Menghapus Buku Dari Bookshelf?")) {
        removeBookTitleFromReaded(newBook.id);
        var x = document.getElementById("snackbar");
        x.children[3].className = "show";
        setTimeout(function () {
          x.children[3].className = x.children[3].className.replace("show", "");     
         },2000);
      } else {
      }
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

document.addEventListener(EVENT_CHANGE, function () {
  const list = books.length;
  const read = [];
  const unRead = [];
  const unReadBooksList = document.getElementById("books");
  unReadBooksList.innerHTML = "";

  const readBookList = document.getElementById("books-items");
  readBookList.innerHTML = "";

  const unReadBook = document.getElementById("unread-book");
  unReadBook.innerText = "";
  const readBook = document.getElementById("read-book");
  readBook.innerText = "";

  for (const bookItem of books) {
    const bookList = makeBook(bookItem);
    if (bookItem.isComplete) {
      readBookList.append(bookList);
      read.push(readBookList);
      readBook.innerText = read.length;
    } else {
      unReadBooksList.append(bookList);
      unRead.push(bookList);
      unReadBook.innerText = unRead.length;
    }
  }
  ifNoList();
  totalOfBooks();
});

function ifNoList() {
  const list = books.length;
  const container = document.querySelector(".no-list");
  if (list == 0) {
    container.classList.add("picture");
  } else {
    container.classList.remove("picture");
  }
}

const resetList = document.getElementById("btn-reset");
resetList.addEventListener("click", function () {
  const reset = books.length;
  if (reset == 0) {
    alert("List Kosong");
  } else {
    if (confirm("Anda Yakin Menghapus Semua List?")) {
      resetBookList(reset);
      var x = document.getElementById("snackbar");
        x.children[1].className = "show";
        setTimeout(function () {
          x.children[1].className = x.children[1].className.replace("show", "");     
         },2000);
    }
  }
});

function totalOfBooks() {
  const totalBooks = document.getElementById("total-books");
  totalBooks.innerHTML = books.length;
}

function addBookTitleToReadList(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(EVENT_CHANGE));
  saveData();
}

document.getElementById("bookTitle").addEventListener("keyup", function () {
  const inputValue = document.getElementById("bookTitle").value;
  const listBooks = document.querySelectorAll(".list-item");

  for (let i = 0; i < listBooks.length; i++) {
    if (
      !inputValue ||
      listBooks[i].textContent.toLowerCase().indexOf(inputValue) > -1
    ) {
      listBooks[i].classList.remove("hide");
    } else {
      listBooks[i].classList.add("hide");
    }
  }
});

function findBook(bookId) {
  for (const todoItem of books) {
    if (todoItem.id === bookId) {
      return todoItem;
    }
  }
  return null;
}

function removeBookTitleFromReaded(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(EVENT_CHANGE));
  saveData();
}
function resetBookList(newBook) {
  const resetAll = bookIndex(newBook);

  if (resetAll) return;

  books.splice(resetAll);
  document.dispatchEvent(new Event(EVENT_CHANGE));
  saveData();
}

function undoBookTitleFromReaded(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(EVENT_CHANGE));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function bookIndex(newBook) {
  for (const index in books) {
    if (books[index] === newBook) {
      return index;
    }
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(EVENT_CHANGE));
}
