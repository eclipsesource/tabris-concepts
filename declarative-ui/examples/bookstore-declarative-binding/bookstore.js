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
    "#details": {
      layoutData: {left: 0, right: 0, top: 0, height: 160 + 2 * PAGE_MARGIN}
    },
    "#coverView": {
      layoutData: {height: 160, width: 106, left: PAGE_MARGIN, top: PAGE_MARGIN}
    },
    "#titleView": {
      layoutData: {left: ["#coverView", PAGE_MARGIN], top: PAGE_MARGIN, right: PAGE_MARGIN}
    },
    "#authorView": {
      layoutData: {left: ["#coverView", PAGE_MARGIN], top: ["#titleView", PAGE_MARGIN]}
    },
    "#priceView": {
      layoutData: {left: ["#coverView", PAGE_MARGIN], top: ["#authorView", PAGE_MARGIN]}
    },
    "#separator": {
      layoutData: {height: 1, right: 0, left: 0, top: ["#details", 0]}
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
    itemHeight: 72,
    items: books,
    configureCell: function(cell) { // instead of initializeCell
      cell.apply({
        "#coverView": {
          layoutData: {left: PAGE_MARGIN, centerY: 0, width: 32, height: 48},
          scaleMode: "fit"
        },
        "#titleView": {
          layoutData: {left: 64, right: PAGE_MARGIN, top: PAGE_MARGIN},
          markupEnabled: true,
          textColor: "#4a4a4a"
        },
        "#authorView": {
          layoutData: {left: 64, right: PAGE_MARGIN, top: ["titleView", 4]},
          textColor: "#7b7b7b"
        }
      }).on("change:item", function(widget, book) {
        cell.apply({
          "#coverView": {
            "image": book.image
          },
          "#titleView": {
            "text": book.title
          },
          "#authorView": {
            "text": book.author
          }
        });
      });
    }
  }).on("select", function(target, value) {
    createBookPage(value).open();
  });
}

function createReadBookPage() {
  tabris.createUi("read-book-page").apply({
    "#scrollView": {
      layoutData: {left: 0, right: 0, top: 0, bottom: 0}
    },
    "#titleView": {
      layoutData: {left: PAGE_MARGIN, top: PAGE_MARGIN * 2, right: PAGE_MARGIN},
    },
    "#textView": {
      layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: ["#titleView", PAGE_MARGIN], bottom: PAGE_MARGIN},
    }
  });
}

function createSettingsPage() {
  tabris.createUi("settings-page").apply({
    "#licenseView": {
      layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: PAGE_MARGIN}
    },
    "#linkView": {
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
