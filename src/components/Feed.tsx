import React from 'react';
import { auth } from '../util/firebase';
const Feed = () => {
  const handleLogout = async () => {
    auth
      .signOut()
      .then(function () {
        console.log('sign out bye');
      })
      .catch(function (error) {
        // An error happened.
        console.log('エラー発生');
        console.log(error.errorMessage);
      });
  };
  return (
    <div>
      Feed
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default Feed;
