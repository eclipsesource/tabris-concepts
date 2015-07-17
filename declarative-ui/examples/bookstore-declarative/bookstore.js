var PAGE_MARGIN = 16;
var books = require("./books.json");
var popularBooks = books.filter(function(book) {
  return book.popular;
});
var favoriteBooks = books.filter(function(book) {
  return book.favorite;
});

tabris.create("Drawer").append(tabris.create("PageSelector"));

tabris.create("Action", {
  title: "Settings",
  image: {src: "images/action_settings.png", scale: 3}
}).on("select", function() {
  createSettingsPage().open();
});

createBookListPage("Book Store", "images/page_all_books.png", books).open();
createBookListPage("Popular", "images/page_popular_books.png", popularBooks);
createBookListPage("Favorite", "images/page_favorite_books.png", favoriteBooks);

function createBookListPage(title, image, model) {
  var page = tabris.createUi("book-list-page").apply({
    "Page": {
      title: title,
      image: {src: image, scale: 3}
    }
  });
  configureBookList(page, model);
}

function createBookPage(book) {
  var page = tabris.createUi("book-page").apply({
    "Page": {
      title: book.title
    },
    "#details": {
      background: "white",
      highlightOnTouch: true,
      layoutData: {left: 0, right: 0, top: 0, height: 160 + 2 * PAGE_MARGIN}
    },
    "#coverView": {
      image: book.image,
      layoutData: {height: 160, width: 106, left: PAGE_MARGIN, top: PAGE_MARGIN}
    },
    "#titleView": {
      markupEnabled: true,
      text: "<b>" + book.title + "</b>",
      layoutData: {left: ["#coverView", PAGE_MARGIN], top: PAGE_MARGIN, right: PAGE_MARGIN}
    },
    "#authorView": {
      text: book.author,
      layoutData: {left: ["#coverView", PAGE_MARGIN], top: ["#titleView", PAGE_MARGIN]}
    },
    "#priceView": {
      layoutData: {left: ["#coverView", PAGE_MARGIN], top: ["#authorView", PAGE_MARGIN]},
      textColor: "rgb(102, 153, 0)",
      text: "EUR 12,95"
    },
    "#separator": {
      layoutData: {height: 1, right: 0, left: 0, top: ["#details", 0]},
      background: "rgba(0, 0, 0, 0.1)"
    },
    "TabFolder": {
      tabBarLocation: "top",
      paging: true,
      layoutData: {top: ["#details", 0], left: 0, right: 0, bottom: 0}
    },
    "#commentsView": {
      layoutData: {left: PAGE_MARGIN, top: PAGE_MARGIN, right: PAGE_MARGIN},
      text: "Great Book."
    }
  });
  page.find("#details").on("tap", function() {
    createReadBookPage(book).open();
  });
  configureBookList(page);
}

function configureBookList(page, books) {
  page.find("#booksList").set({
    layoutData: {left: 0, right: 0, top: 0, bottom: 0},
    items: books,
    configureCell: function(cell) { // instead of initializeCell
      cell.apply({
        "#coverView": {
          layoutData: {left: PAGE_MARGIN, centerY: 0, width: 32, height: 48}
        },
        "#titleView": {
          layoutData: {left: 64, right: PAGE_MARGIN, top: PAGE_MARGIN}
        },
        "#authorView": {
          layoutData: {left: 64, right: PAGE_MARGIN, top: ["titleView", 4]}
        }
      });
    }
  }).on("select", function(target, value) {
    createBookPage(value).open();
  });
}

function createReadBookPage(book) {
  tabris.createUi("read-book-page").apply({
    "Page": {
      title: book.title
    },
    "#scrollView": {
      layoutData: {left: 0, right: 0, top: 0, bottom: 0}
    },
    "#titleView": {
      layoutData: {left: PAGE_MARGIN, top: PAGE_MARGIN * 2, right: PAGE_MARGIN},
      text: "<b>" + book.title + "</b>"
    },
    "#textView": {
      layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: ["#titleView", PAGE_MARGIN], bottom: PAGE_MARGIN},
      text: "bla bla bla\n\n"
    }
  });
}

function createSettingsPage() {
  var url = "https://www.flickr.com/photos/ajourneyroundmyskull/sets/72157626894978086/";
  tabris.createUi("settings-page").apply({
    "Page": {
      title: "License"
    },
    "#licenseView": {
      text: "Book covers come under CC BY 2.0",
      layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: PAGE_MARGIN}
    },
    "#linkView": {
      text: "<a href=\"" + url + "\">Covers on flickr</a>",
      markupEnabled: true,
      layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: ["#settingsView", 10]}
    },
    "#autorsView": {
      text: ["<i>Authors of book covers:</i>",
        "Paula Rodriguez - 1984",
        "Marc Storrs and Rob Morphy - Na Tropie Nieznanych",
        "Cat Finnie - Stary Czlowiek I Morze",
        "Andrew Brozyna - Hobbit",
        "Viacheslav Vystupov - Wojna Swiatow",
        "Marc Storrs and Rob Morphy - Zegar Pomaranczowy Pracz",
        "Andrew Evan Harner - Ksiega Dzungli"].join("<br/>"),
      markupEnabled: true,
      layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: ["#linkView", 10]}
    }
  });
}
