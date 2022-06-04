import app from 'flarum/forum/app';
import DiscussionFlaggedDuplicatePost from './components/DiscussionFlaggedDuplicatePost';
import extendFlagModal from './extendFlagModal';

app.initializers.add('blomstra/flag-duplicates', () => {
  app.postComponents.discussionFlaggedDuplicate = DiscussionFlaggedDuplicatePost;
  extendFlagModal();
});
