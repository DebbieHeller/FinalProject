import React, { useContext, useState, useEffect } from 'react';
import { userContext } from '../src/App';
import { useNavigate } from "react-router-dom";
import { FaTimes, FaTrash } from 'react-icons/fa';

function Cart({ setIsCartVisible, cart, setCart, setBooks, setRecommendedBooks }) {
    const { user } = useContext(userContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [subscriptionTypes, setSubscriptionTypes] = useState([]);
    const [userBooks, setUserBooks] = useState([]);
    const [remainingBooksToBorrow, setRemainingBooksToBorrow] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:3000/borrows?userId=${user.id}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                setUserBooks(data.length);
            })
            .catch((error) => console.error("Error fetching books:", error));
    }, [user.id]);

    useEffect(() => {
        fetch(`http://localhost:3000/subscriptionTypes`, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((subscriptionTypes) => {
                setSubscriptionTypes(subscriptionTypes);
                const userSubscription = subscriptionTypes.find(subscription => subscription.id === user.subscriptionTypeId);
                if (userSubscription) {
                    setRemainingBooksToBorrow(userSubscription.ammountToBorrow - userBooks);
                }
            })
            .catch((error) => console.error('Error fetching subscription types:', error));
    }, [user.subscriptionTypeId, userBooks.length]);

    const removeFromCart = (bookId) => {
        setCart(cart.filter(cartItem => cartItem.id !== bookId));
        setErrorMessage('');
    };

    const handleCartSubmit = () => {
        const userSubscription = subscriptionTypes.find(subscription => subscription.id === user.subscriptionTypeId);

        if (!userSubscription) {
            setErrorMessage('User subscription information not found.');
            clearErrorMessage();
            return;
        }

        if (cart.length > remainingBooksToBorrow) {
            setErrorMessage(`You cannot borrow more than ${remainingBooksToBorrow} books.`);
            clearErrorMessage();
            return;
        }

        cart.forEach(book => {
            const newBorrow = {
                copyBookId: book.copyBookId,
                userId: user.id,
                borrowDate: new Date().toLocaleDateString('en-CA'),
                returnDate: null,
                status: 'Borrowed',
                isReturned: false,
                isIntact: null
            };
            fetch('http://localhost:3000/borrows', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBorrow),
            })
                .catch((error) => console.error('Error adding books to cart:', error));
        });

        setRecommendedBooks((prev) => prev.filter(recommendedBook => !cart.some(cartItem => cartItem.id === recommendedBook.id)));
        setBooks((prev) => prev.filter(book => !cart.some(cartItem => cartItem.id === book.id)));
        setCart([]);
        setRemainingBooksToBorrow(remainingBooksToBorrow - cart.length);
        setIsCartVisible(false)
        alert('ההשאלה התבצעה בהצלחה');
        navigate("/home/user-books");
    };

    const clearErrorMessage = () => {
        setTimeout(() => {
            setErrorMessage('');
        }, 3000); 
    };

    return (
        <>
            <div className="cart-container">
                <div className="cart">
                    <div className="cart-header">
                        <FaTimes onClick={() => setIsCartVisible((prev) => !prev)} className="close-icon" />
                        <h3>סל ההשאלה</h3>
                    </div>
                    {cart.length === 0 ? (
                        <p>הסל שלך ריק</p>
                    ) : (
                        cart.map(book => (
                            <div key={book.copyBookId} className="cart-item">
                                <img src={`http://localhost:3000/images/${book.image}`} alt={book.nameBook} className="cart-image-small" />
                                <div className="cart-item-details">
                                    <p>{book.nameBook}</p>
                                    <FaTrash onClick={() => removeFromCart(book.id)} className="remove-icon" />
                                </div>
                            </div>
                        ))
                    )}
                    {cart.length > 0 && (
                        <button className="cart-submit" onClick={handleCartSubmit}>
                            אישור
                        </button>
                    )}
                    {errorMessage && (
                        <div className="error-message">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Cart