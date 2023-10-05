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

const Post: React.FC<PROPS> = (props) => {
return (
<div>{props.postId}</div>
)
}

export default Post
