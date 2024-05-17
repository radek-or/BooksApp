document.addEventListener("DOMContentLoaded", function () {
	render();
	initActions();
	filterBooks(); // Uruchomienie filtra po załadowaniu strony
});

const favoriteBooks = [];
const filters = [];

function render() {
	const template = document.getElementById("template-book").innerHTML;
	const booksList = document.querySelector(".books-list");

	for (let book of dataSource.books) {
		const ratingBgc = determineRatingBgc(book.rating);
		const ratingWidth = book.rating * 10;

		const bookData = {
			...book,
			ratingBgc,
			ratingWidth,
		};

		const generatedHTML = Handlebars.compile(template)(bookData);
		const element = utils.createDOMFromHTML(generatedHTML);
		booksList.appendChild(element);
	}
}

function determineRatingBgc(rating) {
	if (rating < 6) {
		return "linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)";
	} else if (rating > 6 && rating <= 8) {
		return "linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)";
	} else if (rating > 8 && rating <= 9) {
		return "linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)";
	} else if (rating > 9) {
		return "linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)";
	}
}

function initActions() {
	const booksList = document.querySelector(".books-list");
	const filtersContainer = document.querySelector(".filters");

	if (booksList) {
		// Nasłuchiwanie na podwójne kliknięcie w kontenerze książek
		booksList.addEventListener("dblclick", function (event) {
			event.preventDefault();

			const bookImage = event.target.offsetParent;

			if (bookImage && bookImage.classList.contains("book__image")) {
				const bookId = bookImage.getAttribute("data-id");

				if (!favoriteBooks.includes(bookId)) {
					favoriteBooks.push(bookId);
					bookImage.classList.add("favorite");
				} else {
					const index = favoriteBooks.indexOf(bookId);
					favoriteBooks.splice(index, 1);
					bookImage.classList.remove("favorite");
				}

				console.log("Favorite Books:", favoriteBooks);
			}
		});
	}

	if (filtersContainer) {
		// Nasłuchiwanie na zmiany w formularzu filtrów
		filtersContainer.addEventListener("click", function (event) {
			if (
				event.target.tagName === "INPUT" &&
				event.target.type === "checkbox" &&
				event.target.name === "filter"
			) {
				const filterValue = event.target.value;

				if (event.target.checked) {
					filters.push(filterValue);
				} else {
					const index = filters.indexOf(filterValue);
					if (index !== -1) {
						filters.splice(index, 1);
					}
				}

				console.log("Selected filters:", filters);
				filterBooks(); // Wywołanie funkcji filtrującej po zmianie filtra
			}
		});
	} else {
		console.error("Element .filters nie został znaleziony.");
	}
}

function filterBooks() {
	const booksList = document.querySelectorAll(".books-list .book");

	for (let bookElement of booksList) {
		const bookId = bookElement
			.querySelector(".book__image")
			.getAttribute("data-id");
		const book = dataSource.books.find((book) => book.id == bookId);

		let shouldBeHidden = false;

		// Sprawdzenie, czy książka spełnia wszystkie wybrane filtry
		for (const filter of filters) {
			if (!book.details[filter]) {
				shouldBeHidden = true;
				break;
			}
		}

		if (shouldBeHidden) {
			console.log(`Hiding book: ${book.name}`);
			bookElement.classList.add("hidden");
		} else {
			console.log(`Showing book: ${book.name}`);
			bookElement.classList.remove("hidden");
		}
	}
}
