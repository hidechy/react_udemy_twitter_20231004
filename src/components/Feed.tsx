import { auth } from '../firebase'
import TweetInput from './TweetInput'
import styles from './Feed.module.css'

const Feed = () => {
return (
<div className={styles.feed}>Feed

<TweetInput />

<div>
<button onClick={()=>auth.signOut()}>Logout</button>
</div>

</div>
)
}

export default Feed
