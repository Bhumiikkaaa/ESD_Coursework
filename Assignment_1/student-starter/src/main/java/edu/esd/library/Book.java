package edu.esd.library;

import java.time.Year;

/**
 * A book in the library catalogue.
 *
 * <p>Guidelines:
 * <ul>
 *   <li>Fields: isbn, title, author, year -- all {@code private final}. No setters.</li>
 *   <li>Two books are equal if and only if they have the same ISBN.</li>
 * </ul>
 */
public class Book {

    // TODO: declare the four fields (private final)

    /**
     * Creates a book.
     *
     * @throws IllegalArgumentException if
     *     <ul>
     *       <li>isbn is null or is not exactly 13 digits (e.g. "9780134685991"),</li>
     *       <li>title or author is null or blank,</li>
     *       <li>year is after the current year.</li>
     *     </ul>
     */
    public Book(String isbn, String title, String author, int year) {
        throw new UnsupportedOperationException("TODO: implement the constructor");
    }

    public String getIsbn() {
        throw new UnsupportedOperationException("TODO");
    }

    public String getTitle() {
        throw new UnsupportedOperationException("TODO");
    }

    public String getAuthor() {
        throw new UnsupportedOperationException("TODO");
    }

    public int getYear() {
        throw new UnsupportedOperationException("TODO");
    }

    // TODO: override equals and hashCode (use ONLY the ISBN), and toString (show ISBN and title).
}
