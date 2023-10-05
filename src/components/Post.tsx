import React from 'react'

import { useState, useEffect } from 'react'
import styles from './Post.module.css'
import {db} from '../firebase'
import firebase from 'firebase/app'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import { Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MessageIcon from '@material-ui/icons/Message'
import SendIcon from '@material-ui/icons/Send'

interface PROPS {
    postId: string;
    avatar: string;
    image: string;
    text: string;
    timestamp: any;
    username: string;
}

interface COMMENT {
    id: string;
    avatar: string;
    text: string;
    timestamp: any;
    username: string;
}



const Post: React.FC<PROPS> = (props) => {

    const user = useSelector(selectUser);

    const [comment, setComment] = useState("");

    const newComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        db.collection("posts").doc(props.postId).collection("comments").add({
            avatar: user.photoUrl,
            text: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            username: user.displayName,
        });

        setComment("");
    };



    const [comments, setComments] = useState<COMMENT[]>([
        {
            id: "",
            avatar: "",
            text: "",
            timestamp: null,
            username: "",
        }
    ]);

    useEffect(() => {
        const unsub = db.collection("posts").doc(props.postId)
        .collection("comments").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
            setComments(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    avatar: doc.data().avatar,
                    text: doc.data().text,
                    username: doc.data().username,
                    timestamp: doc.data().timestamp,
                }))
            );
        })

        return () => {
            unsub();
        };
    }, [props.postId]);



    return (
        <div className={styles.post}>

            <div className={styles.post_avatar}>
                <Avatar src={props.avatar} />
            </div>

            <div className={styles.post_body}>
                <div>
                    <div className={styles.post_header}>
                        <h3>
                            <span className={styles.post_headerUser}>@{props.username}</span>
                            <span className={styles.post_headerTime}>{new Date(props.timestamp?.toDate()).toLocaleString()}</span>
                        </h3>
                    </div>

                    <div className={styles.post_tweet}>
                        <p>{props.text}</p>
                    </div>
                </div>

                {props.image && (
                    <div className={styles.post_tweetImage}>
                        <img src={props.image} alt='tweet' />
                    </div>
                )}



                {comments.map((comment) => (
                    <div key={comment.id} className={styles.post_comment}>
                        <Avatar src={comment.avatar} />
                        <span className={styles.post_commentUser}>@{comment.username}</span>
                        <span className={styles.post_commentText}>{comment.text}</span>
                        <span className={styles.post_headerTime}>
                            {new Date(comment.timestamp?.toDate()).toLocaleString()}
                        </span>
                    </div>
                ))}



                <form onSubmit={newComment}>
                    <div className={styles.post_form}>
                        <input
                        className={styles.post_input}
                        type='text'
                        placeholder='comment input'
                        value={comment}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setComment(e.target.value)
                        }}
                        />

                        <button
                        disabled={!comment}
                        className={
                            comment ? styles.post_button : styles.post_buttonDisable
                        }
                        type='submit'
                        >
                            <SendIcon className={styles.post_sendIcon} />
                        </button>
                    </div>
                </form>

            </div>

        </div>
    )
}

export default Post
