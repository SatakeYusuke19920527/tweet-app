import React, { useState } from 'react';
import styles from './TweetInput.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { auth, storage, db } from '../util/firebase';
import { Avatar, Button, IconButton } from '@material-ui/core';
import firebase from 'firebase/app';
import AddAPhoto from '@material-ui/icons/AddAPhoto';

const TweetInput = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState<string>('make sense');
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = '';
    }
  };
  // const sendTweet = async (e: React.FormEvent<HTMLFormElement>) => {
  const sendTweet = async () => {
    // e.preventDefault();
    if (tweetImage) {
      const S =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join('');
      const fileName = randomChar + '_' + tweetImage.name;
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage);

      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await storage
            .ref('images')
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection('posts').add({
                uid: user.uid,
                name: user.displayName,
                image: url,
                text: tweetMsg,
                photoUrl: user.photoUrl,
                createAt: firebase.firestore.FieldValue.serverTimestamp(),
              });
            });
        }
      );
    } else {
      await db
        .collection('posts')
        .add({
          uid: user.uid,
          name: user.displayName,
          image: '',
          text: tweetMsg,
          photoUrl: user.photoUrl,
          createAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function (docRef) {
          console.log('Document written with ID: ', docRef.id);
          setTweetImage(null);
          setTweetMsg('');
        })
        .catch(function (error) {
          console.error('Error adding document: ', error);
        });
    }
  };

  return (
    <div>
      <Avatar
        className={styles.tweet_avatar}
        alt={user.displayName}
        src={user.photoUrl}
        onClick={async () => await auth.signOut()}
      />
      <button onClick={sendTweet}>send</button>
      <h1>TweetInput</h1>
    </div>
  );
};

export default TweetInput;
