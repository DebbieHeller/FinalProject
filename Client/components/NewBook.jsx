import React, { useContext, useState } from 'react';

function NewBook({setShowAddBookModal, setBooks}) {
    
    const [newBook, setNewBook] = useState({
        nameBook: '',
        author: '',
        numOfPages: '',
        publishingYear: '',
        summary: '',
        image: null,
        category: '',
      });

    const handleAddBookChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewBook(prevState => ({
          ...prevState,
          [name]: type === 'checkbox' ? checked : value
        }));
      };

  const handleAddBookSubmit = () => {
    const formData = new FormData();
    for (const key in newBook) {
      formData.append(key, newBook[key]);
    }
    fetch('http://localhost:3000/books', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks((books) => [data, ...books]);
        setShowAddBookModal(false);
      })
      .catch((error) => console.error('Error adding book:', error));
  };

  const handleImageChange = (e) => {
    setNewBook(prevState => ({
      ...prevState,
      image: e.target.files[0]
    }));
  };

    return (
        <>
        <div className="modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-right" onClick={() => setShowAddBookModal(false)}>&times;</span>
            <h2>הוספת ספר חדש</h2>
            <form className="add-book-form" onSubmit={(e) => { e.preventDefault(); handleAddBookSubmit(); }}>
              <input
                type="text"
                name="nameBook"
                placeholder="שם ספר"
                value={newBook.nameBook}
                onChange={handleAddBookChange}
                required
              />
              <input
                type="text"
                name="author"
                placeholder="שם סופר"
                value={newBook.author}
                onChange={handleAddBookChange}
                required
              />
              <input
                type="number"
                name="numOfPages"
                placeholder="מספר עמודים"
                value={newBook.numOfPages}
                onChange={handleAddBookChange}
                required
              />
              <input
                type="number"
                name="publishingYear"
                placeholder="שנת הוצאה לאור"
                value={newBook.publishingYear}
                onChange={handleAddBookChange}
                required
              />
              <textarea
                name="summary"
                placeholder="תקציר"
                value={newBook.summary}
                onChange={handleAddBookChange}
                required
              />
              <select
                name="category"
                value={newBook.category}
                onChange={handleAddBookChange}
                required
              >
                <option value="">בחר קטגוריה</option>
                <option value="fiction">סיפורת</option>
                <option value="non-fiction">עיון</option>
                <option value="fantasy">פנטזיה</option>
                <option value="mystery">מסתורין</option>
                <option value="biography">ביוגרפיה</option>
                <option value="science-fiction">מדע בדיוני</option>
                <option value="history">היסטוריה</option>
                <option value="romance">רומן</option>
                <option value="self-help">עזרה עצמית</option>
                <option value="other">אחר</option>
              </select>
              <label>תמונה</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              <button type="submit">אישור</button>
            </form>
          </div>
        </div>
        </>
    )
}

export default NewBook