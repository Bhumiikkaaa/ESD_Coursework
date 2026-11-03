package edu.esd.library;

import java.util.List;

/**
 * The library catalogue: the books the library owns and how many copies of each.
 *
 * <p>Guidelines:
 * <ul>
 *   <li>Store books in a {@code Map<String, Book>} keyed by ISBN.</li>
 *   <li>Store copy counts in two maps keyed by ISBN:
 *       {@code Map<String, Integer> totalCopies} and {@code Map<String, Integer> availableCopies}.</li>
 *   <li>Use {@code HashMap} for all three.</li>
 *   <li>Never return null to mean "not found" -- throw the exception instead.</li>
 * </ul>
 */
public class Catalogue {

    // TODO: declare the three maps described above

    /**
     * Adds a new book with the given number of copies. All copies start on the shelf.
     *
     * @throws IllegalArgumentException if copies is less than 1
     * @throws DuplicateBookException   if a book with the same ISBN already exists
     */
    public void addBook(Book book, int copies) {
        throw new UnsupportedOperationException("TODO: implement addBook");
    }

    /**
     * @throws BookNotFoundException if there is no book with this ISBN
     */
    public Book findByIsbn(String isbn) {
        throw new UnsupportedOperationException("TODO: implement findByIsbn");
    }

    /**
     * Finds books whose author contains {@code name}, ignoring upper/lower case.
     * For example "bloch" matches "Joshua Bloch".
     *
     * <p>Use a stream: filter, then sorted(Comparator.comparing(Book::getTitle)), then toList().
     *
     * @return matching books sorted by title; an empty list if none match
     */
    public List<Book> searchByAuthor(String name) {
        throw new UnsupportedOperationException("TODO: implement searchByAuthor");
    }

    /**
     * Lends one copy: one fewer copy on the shelf.
     *
     * @throws BookNotFoundException       if there is no book with this ISBN
     * @throws NoCopiesAvailableException  if no copy is on the shelf
     */
    public void lendCopy(String isbn) {
        throw new UnsupportedOperationException("TODO: implement lendCopy");
    }

    /**
     * Takes a copy back: one more copy on the shelf.
     *
     * @throws BookNotFoundException  if there is no book with this ISBN
     * @throws IllegalStateException  if all copies are already on the shelf
     */
    public void returnCopy(String isbn) {
        throw new UnsupportedOperationException("TODO: implement returnCopy");
    }

    /**
     * @return the number of copies on the shelf right now
     * @throws BookNotFoundException if there is no book with this ISBN
     */
    public int availableCopies(String isbn) {
        throw new UnsupportedOperationException("TODO: implement availableCopies");
    }
}
