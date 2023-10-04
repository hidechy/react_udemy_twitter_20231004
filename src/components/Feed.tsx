import { auth } from '../firebase'
import TweetInput from './TweetInput'

const Feed = () => {
return (
<div>Feed

<TweetInput />

<div>
<button onClick={()=>auth.signOut()}>Logout</button>
</div>

</div>
)
}

export default Feed
