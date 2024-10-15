class Book {
    constructor(title = 'Unknown', author = 'Unknown', pages = '0', isRead = false) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(newBook) {
        if (!this.isInLibrary(newBook)) {
            this.books.push(newBook);
        }
    }

    removeBook(title) {
        this.books = this.books.filter((book) => book.title !== title);
    }

    getBook(title) {
        return this.books.find((book) => book.title === title);
    }

    isInLibrary(newBook) {
        return this.books.some((book) => book.title === newBook.title);
    }
}

const library = new Library();
const errorMsg = document.getElementById('errorMsg');
const booksGrid = document.getElementById('booksGrid');
const bookForm = document.getElementById('bookForm');

// Default books to be added to library
const defaultBooks = [
    new Book("The Hobbit", "J.R.R. Tolkien", 295, true),
    new Book("How to Be Better at Almost Everything", "Pat Flynn", 232, true),
    new Book("Start with Why", "Simon Sinek", 256, false),
    new Book("Think Again", "Adam Grant", 320, true)
];

const updateBooksGrid = () => {
    booksGrid.innerHTML = '';
    library.books.forEach((book) => createBookCard(book));
};

const createBookCard = (book) => {
    const bookCard = document.createElement('div');
    const title = document.createElement('p');
    const author = document.createElement('p');
    const pages = document.createElement('p');
    const buttonGroup = document.createElement('div');
    const readBtn = document.createElement('button');
    const removeBtn = document.createElement('button');

    bookCard.classList.add('book-card');
    buttonGroup.classList.add('card-button');
    readBtn.classList.add('btn');
    removeBtn.classList.add('btn');

    title.textContent = `"${book.title}"`;
    author.textContent = book.author;
    pages.textContent = `${book.pages} pages`;
    removeBtn.textContent = 'Remove';

    if (book.isRead) {
        readBtn.textContent = 'Read';
        readBtn.classList.add('btn-light-green');
    } else {
        readBtn.textContent = 'Not read';
        readBtn.classList.add('btn-light-red');
    }

    readBtn.onclick = () => toggleRead(book.title);
    removeBtn.onclick = () => removeBook(book.title);

    buttonGroup.appendChild(readBtn);
    buttonGroup.appendChild(removeBtn);
    bookCard.append(title, author, pages, buttonGroup);
    booksGrid.appendChild(bookCard);
};

const toggleRead = (title) => {
    const book = library.getBook(title);
    if (book) {
        book.isRead = !book.isRead;
        saveLocal();
        updateBooksGrid();
    }
};

const removeBook = (title) => {
    library.removeBook(title);
    saveLocal();
    updateBooksGrid();
};

const addBook = (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const isRead = document.getElementById('isRead').checked;
    const newBook = new Book(title, author, pages, isRead);

    if (library.isInLibrary(newBook)) {
        errorMsg.textContent = 'This book already exists in your library';
        errorMsg.classList.add('active');
        return;
    }

    library.addBook(newBook);
    saveLocal();
    updateBooksGrid();
    errorMsg.textContent = '';
    bookForm.reset();
};

bookForm.onsubmit = addBook;

const saveLocal = () => {
    localStorage.setItem('library', JSON.stringify(library.books));
};

const restoreLocal = () => {
    const books = JSON.parse(localStorage.getItem('library'));
    if (books && books.length > 0) {
        library.books = books.map((book) => new Book(book.title, book.author, book.pages, book.isRead));
    } else {
        defaultBooks.forEach((book) => library.addBook(book)); // Load default books if local storage is empty
        saveLocal();
    }
    updateBooksGrid();
};

// Initialize library with local storage or default books
restoreLocal();