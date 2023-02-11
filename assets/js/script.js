let addBookForm = document.getElementById("addBookForm");
let bookFounded = document.getElementById("bookFounded");
let books = [];
let completedBookList = document.getElementById("completedBookList");
let newArray = [];
let RENDER_EVENT = new Event("render-books");
let STORAGE_KEY = "Bookshelf App";

function generateItemCover() {
  return (randomColor = Math.floor(Math.random() * 16777215).toString(16));
}

function generateId() {
  return +new Date();
}

function clearInput() {
  judul.value = "";
  penulis.value = "";
  tahun.value = "";
  isReaded.checked = false;
}

function createBookObject(judul, penulis, tahun, isReaded) {
  return {
    id: generateId(),
    judul,
    penulis,
    tahun,
    isReaded,
    itemCover: generateItemCover(),
  };
}

let uncompletedBookList = document.getElementById("uncompletedBookList");
addBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let judul = document.getElementById("judul").value;
  let penulis = document.getElementById("penulis").value;
  let tahun = document.getElementById("tahun").value;
  let bookObject = createBookObject(judul, penulis, tahun, isReaded.checked);
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  alert(`Buku dengan judul ${judul} berhasil ditambahkan!`);
  saveData();
  clearInput();
});

function createItemElement(id, judul, penulis, tahun, isReaded, itemCover) {
  let status = undefined;
  let firstCharacter = judul.charAt(0);
  status = "restore__icon";
  if (isReaded === false) {
    status = "check__icon";
  }
  let element = `<li class="book__item" id="${id}">
  <div class="item__cover" style="background-color: #${itemCover}">${firstCharacter}</div>
  <div class="item__desc">
    <div class="item__text">
      <div class="item__title">${judul}</div>
      <div class="item__penulis">${penulis}</div>
      <div class="item__tahun">${tahun}</div>
    </div>
    <div class="item__action">
      <div class="${status} icon--smaller icon--pointer"></div>
      <div class="remove__icon icon--smaller icon--pointer"></div>
    </div>
  </div>
</li>`;
  return element;
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id == bookId) {
      return book;
    }
  }
}

function findSearchBook(bookId) {
  for (const book of newArray) {
    if (book.id == bookId) {
      return book;
    }
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function loadDataFromStorage() {
  let bookData = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (bookData != null) {
    for (const book of bookData) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", () => {
  let isReaded = document.getElementById("isReaded");
  isReaded.checked = false;
  loadDataFromStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
});

document.addEventListener(RENDER_EVENT, () => {
  uncompletedBookList.innerHTML = "";
  completedBookList.innerHTML = "";
  bookFounded.innerHTML = "";
  if (newArray.length != 0) {
    for (const item of newArray) {
      let element = createItemElement(item.id, item.judul, item.penulis, item.tahun, item.isReaded, item.itemCover);
      bookFounded.insertAdjacentHTML("afterbegin", element);
    }
  }

  if (books.length != 0) {
    for (const item of books) {
      let newElement = createItemElement(item.id, item.judul, item.penulis, item.tahun, item.isReaded, item.itemCover);
      if (item.isReaded == false) {
        uncompletedBookList.insertAdjacentHTML("afterbegin", newElement);
      } else {
        completedBookList.insertAdjacentHTML("afterbegin", newElement);
      }
    }
  }

  let markAsCompleteButton = Array.from(document.querySelectorAll(".check__icon"));
  markAsCompleteButton.forEach((e) => {
    e.addEventListener("click", () => {
      let book = findBook(e.parentElement.parentElement.parentElement.getAttribute("id"));
      let sure = confirm(`Pindahkan buku ${book.judul} ke daftar buku selesai dibaca?`);
      if (sure) {
        books[books.indexOf(book)].isReaded = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
      }
    });
  });

  let restoreButton = Array.from(document.querySelectorAll(".restore__icon"));
  restoreButton.forEach((e) => {
    e.addEventListener("click", () => {
      let book = findBook(e.parentElement.parentElement.parentElement.getAttribute("id"));
      let sure = confirm(`Pindahkan buku ${book.judul} ke daftar buku yang belum selesai dibaca?`);
      if (sure) {
        books[books.indexOf(book)].isReaded = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
      }
    });
  });

  let removeButton = Array.from(document.querySelectorAll(".remove__icon"));
  removeButton.forEach((e) => {
    e.addEventListener("click", () => {
      let id = e.parentElement.parentElement.parentElement.getAttribute("id");
      let sure = confirm(`Anda yakin ingin menghapus buku ${findBook(id).judul} ?`);

      if (sure) {
        books.splice(books.indexOf(findBook(id)), 1);
        if (newArray.length != 0) {
          newArray.splice(newArray.indexOf(findSearchBook(id)), 1);
          document.dispatchEvent(new Event(RENDER_EVENT));
        }
        saveData();
        document.dispatchEvent(new Event(RENDER_EVENT));
      }
    });
  });

  let searchForm = document.getElementById("searchForm");
  let searchBox = document.getElementById("searchBox");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookFounded.innerHTML = "";
    if (searchBox.value != 0) {
      newArray = searchByTitle(searchBox.value.toUpperCase());
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  });
});

function searchByTitle(string) {
  let tempArray = [];
  for (const item of books) {
    if (item.judul.toUpperCase().includes(string)) {
      tempArray.push(item);
      continue;
    }
  }
  return tempArray;
}
