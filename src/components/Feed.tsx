import React, { useState, useEffect } from 'react';
import TweetInput from './TweetInput';
import styles from './Feed.module.css';
import { db } from '../util/firebase';
const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: '',
      avatar: '',
      image: '',
      text: '',
      timestamp: null,
      username: '',
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection('posts')
      .orderBy('createAt', 'asc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.data().uid,
            avatar: doc.data().photoUrl,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().createAt,
            username: doc.data().name,
          }))
        );
      });
    return () => unSub();
  }, []);

  return (
    <div className={styles.feed}>
      <TweetInput />
      {posts.map((post) => {
        return <div>{post.text}</div>;
      })}
    </div>
  );
};

export default Feed;
