import "../css/home.css";
import React, { useContext } from 'react';
import { userContext } from '../src/App';
import NewBorrow from "./NewBorrow";

function Warnable() {
  const { user } = useContext(userContext);

  return (
    <div>
      {user && user.isWarned ? (
        <div className="WarnMessage">
          הינך משתמש מוזהר, לא תוכל להשאיל ספרים עד שתסדיר את העניין, בדוק את ההודעות החדשות שהושארו עבורך
        </div>
      ) : (
        <NewBorrow />
      )}
    </div>
  );
}

export default Warnable;
